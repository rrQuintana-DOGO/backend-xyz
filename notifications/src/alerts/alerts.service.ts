import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateAlertDto } from '@alerts/dto/create-alerts.dto';
import { UpdateAlertDto } from '@alerts/dto/update-alerts.dto';
import { CloseAlertDto } from '@alerts/dto/close-alerts.dto';
import { PaginationDto } from '@common/index';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { notificationsSchema, NotificationsHistory } from '@app/mongoose';
import { NATS_SERVICE } from '@app/config';
import { firstValueFrom } from 'rxjs';
import { Alert } from '@alerts/entities/alerts.entity';
import { AlertsHistory } from '@alerts/entities/alerts_history.entity';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async create(createAlertDto: CreateAlertDto, slug: string) {
    const dbConnection = await this.dbManager.getMongoConnection(slug);
    const Notifications = dbConnection.model('notifications', notificationsSchema);
    
    try {
      await firstValueFrom(
        this.client.send({ cmd: 'find-one-unit' }, { id: createAlertDto.id_unit, slug: slug })
      );
    }
    catch (error) {
      throw new RpcException({
        message: `La unidad ${createAlertDto.id_unit} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      await firstValueFrom(
        this.client.send({ cmd: 'find-one-trip' }, { id: createAlertDto.id_trip })
      );
    }
    catch (error) {
      throw new RpcException({
        message: `El viaje ${createAlertDto.id_trip} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      await firstValueFrom(
        this.client.send({ cmd: 'find-one-event' }, { id: createAlertDto.id_event })
      );
    }
    catch (error) {
      throw new RpcException({
        message: `El evento ${createAlertDto.id_trip} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      const notification = await Notifications.create(createAlertDto);

      //return this.findOne(notification._id);

      return notification;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: 'Error al crear notification',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findAllTripsWithAlerts() {
    try {
      const dbConnection = await this.dbManager.getMongoConnection('test');
      const Notifications = dbConnection.model('notifications', notificationsSchema);

      const trips = await Notifications.aggregate([
        {
          $group: {
            _id: "$id_trip"
          }
        },
        {
          $project: {
            _id: 0,
            id_trip: "$_id"
          }
        }
      ]);

      const tripsIds = trips.map(trip => trip.id_trip);

      return tripsIds;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: 'Error al obtener los viajes con alertas',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const dbConnection = await this.dbManager.getMongoConnection('test');
    const Notifications = dbConnection.model('notifications', notificationsSchema);

    const { page, limit } = paginationDto;
  
    const totalRecords = await Notifications.countDocuments({});
    const lastPage = Math.ceil(totalRecords / limit);
  
    const notifications = await Notifications.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  
    const formattedNotifications = await Promise.all(
      notifications.map(async notification => {
        const { trip, trip_log, unit, event } = await this.getMicroservicesData({
          id_trip_log: notification.id_trip_log, 
          id_trip: notification.id_trip, 
          id_unit: notification.id_unit, 
          id_event: notification.id_event
        });
  
        return {
          id_notification: notification?._id,
          id_trip: notification?.id_trip,
          id_ext: trip?.id_ext,
          trip_type: trip.trip_type.name,
          unit: unit.name,
          status: trip_log.status.name,
          situation: trip_log.situation.name,
          event: event?.name,
          alert_time: notification?.register_date.toString(),
        };
      })
    );
  
    return {
      data: formattedNotifications,
      meta: {
        total_records: totalRecords,
        current_page: page,
        total_pages: lastPage,
      },
    };
  }

  async findAllByTrips(paginationDto: PaginationDto) {
    const dbConnection = await this.dbManager.getMongoConnection('test');
    const Notifications = dbConnection.model('notifications', notificationsSchema);

    const { page, limit } = paginationDto;

    const totalTripsCount = await Notifications.aggregate([
      {
        $group: {
          _id: '$id_trip',
        },
      },
      {
        $count: 'totalTrips',
      }
    ]);

    const totalRecords = totalTripsCount.length > 0 ? totalTripsCount[0]?.totalTrips : 0;
    const totalPages = Math.ceil(totalRecords / limit);

    const totalGroupedNotifications = await Notifications.aggregate([
      {
        $sort: { id_trip: 1, register_date: 1 }
      },
      {
        $group: {
          _id: '$id_trip',
          totalNotifications: { $sum: 1 },
          oldestNotification: { $first: '$$ROOT' },
          mostRecentNotification: { $last: '$$ROOT' }
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      }
    ]);

    const data_trips = await Promise.all(totalGroupedNotifications.map(async notification => {
      const { mostRecentNotification, oldestNotification } = notification;
    
      const { unit, trip, trip_log } = await this.getMicroservicesData({ id_unit: oldestNotification?.id_unit, id_trip: oldestNotification?.id_trip, id_trip_log: mostRecentNotification?.id_trip_log });
    
      return {
        id_trip: trip?.id_trip,
        id_ext: trip?.id_ext,
        id_trip_type: trip?.trip_types?.name,
        unit: unit?.name,
        situation: trip_log.situation?.name,
        status: trip_log.status?.name,
        alert_time: oldestNotification?.register_date.toString(),
        active_alerts: notification?.totalNotifications,
      };
    }));

    return {
      data: data_trips,
      meta: {
        total_records: totalRecords,
        current_page: page,
        total_pages: totalPages,
      },
    };
  }

  async findOne(id_notification: string) {
    const dbConnection = await this.dbManager.getMongoConnection('test');
    const Notifications = dbConnection.model('notifications', notificationsSchema);

    let alert: Alert | AlertsHistory;

    try {
      alert = await Notifications.findOne({ _id: id_notification });

      if (!alert) {
        alert = await NotificationsHistory.findOne({ _id: id_notification });

        if (!alert) {
          throw new RpcException({
            message: `La notificación ${id_notification} no existe`,
            status: HttpStatus.BAD_REQUEST,
          });
        }
      }
    }
    catch (error) {
      throw new RpcException({
        message: `La notificación ${id_notification} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const { id_unit, id_trip, id_event, id_trip_log } = alert;

    const { unit, trip, event, trip_log } = await this.getMicroservicesData({
      id_trip_log: id_trip_log, 
      id_trip: id_trip, 
      id_unit: id_unit, 
      id_event: id_event
    });

    return {
      id_notification: alert._id,
      unit,
      trip,
      event,
      trip_log
    };
  }

  async update(id_notification: string, updateAlertDto: UpdateAlertDto) {
    const dbConnection = await this.dbManager.getMongoConnection('test');
    const Notifications = dbConnection.model('notifications', notificationsSchema);

    await this.findOne(id_notification);

    const data = { ...updateAlertDto };
    
    await Notifications.updateOne(
      { _id: id_notification },
      { ...data }
    );

    return this.findOne(id_notification);
  }

  async close_alert(closeAlertDto: CloseAlertDto) {
    const dbConnection = await this.dbManager.getMongoConnection('test');
    const Notifications = dbConnection.model('notifications', notificationsSchema);

    const { id_trip_log_attention, id_notification } = closeAlertDto;

    const notification = await Notifications.findOne({ _id: id_notification });

    if (!notification) {
      const notification_his = await NotificationsHistory.findOne({ _id: id_notification });

      if (!notification_his) {
        throw new RpcException({
          message: `La notificación ${id_notification} no existe`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
      else {
        throw new RpcException({
          message: `La notificación ${id_notification} ya fue cerrada`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    let trip_log_attention;

    try {
      trip_log_attention = await firstValueFrom(
        this.client.send({ cmd: 'find-one-trip-log' }, { id: id_trip_log_attention })
      );
    }
    catch (error) {
      throw new RpcException({
        message: `El trip_log ${id_trip_log_attention} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const { id_trip_log, id_trip, id_unit, id_event } = notification;

    await this.getMicroservicesData({
      id_trip_log:id_trip_log, 
      id_trip: id_trip, 
      id_unit: id_unit, 
      id_event: id_event
    });

    try {
      await NotificationsHistory.create({
        _id: notification?._id,
        id_unit: notification?.id_unit,
        id_trip: notification?.id_trip,
        id_event: notification?.id_event,
        id_trip_log: notification?.id_trip_log,
        register_date: notification?.register_date,
        id_trip_log_attention: trip_log_attention?.id_trip_log,
        id_user_attention: trip_log_attention?.user.id_user,
        attention_date: trip_log_attention?.created_at,
      });

      await Notifications.deleteOne({ _id: id_notification });

      return this.findOne(id_notification);
    }
    catch (error) {
      throw new RpcException({
        message: `Error al cerrar la alerta con id ${id_notification}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error
      });
    }
  }

  async getMicroservicesData({
    id_unit,
    id_trip,
    id_trip_log,
    id_event,
  }: {
    id_unit?: string;
    id_trip?: string;
    id_trip_log?: string;
    id_event?: any;
  }): Promise<any> {
    const result: any = {};
  
    if (id_unit) {
      try {
        result.unit = await firstValueFrom(
          this.client.send({ cmd: 'find-one-unit' }, { id: id_unit })
        );
      } catch (error) {
        throw new RpcException({
          message: `El unit ${id_unit} no existe`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }
  
    if (id_trip) {
      try {
        result.trip = await firstValueFrom(
          this.client.send({ cmd: 'find-one-trip' }, { id: id_trip })
        );
      } catch (error) {
        throw new RpcException({
          message: `El trip ${id_trip} no existe`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }
  
    if (id_trip_log) {
      try {
        result.trip_log = await firstValueFrom(
          this.client.send({ cmd: 'find-one-trip-log' }, { id: id_trip_log })
        );
      } catch (error) {
        throw new RpcException({
          message: `El trip_log ${id_trip_log} no existe`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }
  
    if (id_event) {
      try {
        result.event = await firstValueFrom(
          this.client.send({ cmd: 'find-one-event' }, { id: id_event })
        );
      } catch (error) {
        throw new RpcException({
          message: `El event ${id_event} no existe`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }
  
    return result;
  }
}
