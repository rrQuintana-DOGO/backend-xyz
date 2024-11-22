import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateAlertDto } from '@alerts/dto/create-alerts.dto';
import { UpdateAlertDto } from '@alerts/dto/update-alerts.dto';
import {CreateNotificationsTelemetryDto} from '@alerts/dto/create_notifications-telemetry';
import {CreateNotificationsGeofencesDto} from '@alerts/dto/create-alert-geofence';
import { CloseAlertDto } from '@alerts/dto/close-alerts.dto';
import { PaginationDto } from '@common/index';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { notificationsSchema, NotificationsHistory,notificationsTelemetry,notificationsTelemetrySchema,geofencesTelemetry,geofencesTelemetrySchema } from '@app/mongoose';
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
        this.client.send({ cmd: 'find-one-trip' }, { id: createAlertDto.id_trip, slug: slug })
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
        this.client.send({ cmd: 'find-one-event' }, { id: createAlertDto.id_event, slug: slug })
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

      return notification;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: 'Error al crear notification',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }


  async createNotificationTelemetry(createNotificationTelemetriDto: CreateNotificationsTelemetryDto, slug: string) {
    //return createNotificationTelemetriDto;
    const { location } = createNotificationTelemetriDto as any; // Usar "any" para manejar objetos anidados no declarados directamente en el DTO
    const { lat: latitude, lon: longitude } = location; // Renombrar campos a "latitude" y "longitude"

    // Establecer conexión a la base de datos según el slug
    const dbConnection = await this.dbManager.getMongoConnection(slug);
    const NotificationsHistory = dbConnection.model('notifications_telemetry', notificationsTelemetrySchema);
    const uuid = require('uuid');

    try {
      await firstValueFrom(
        this.client.send({ cmd: 'find-one-event' }, { id: createNotificationTelemetriDto.event_uuid,slug: slug  })
      );
    }
    catch (error) {
      throw new RpcException({
        message: `El evento ${createNotificationTelemetriDto.event_uuid} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      await firstValueFrom(
        this.client.send({ cmd: 'find-one-client' }, { id: createNotificationTelemetriDto.client_uuid,slug: slug })
      );
    }
    catch (error) {
      throw new RpcException({
        message: `El Client ${createNotificationTelemetriDto.client_uuid} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
    //TRIP ID
    //42a4691f-3f19-4aed-bbd1-2e341b8fb86a
    // Mapear los datos al esquema de MongoDB
    const mappedData = {
      _id: uuid.v4(), // Genera un UUID único
      alert: createNotificationTelemetriDto.alert, 
      id_device: createNotificationTelemetriDto.device_id,
      value: createNotificationTelemetriDto.value,
      datetime: createNotificationTelemetriDto.datetime,
      latitude, // Asignar el valor extraído directamente
      longitude, // Asignar el valor extraído directamente
      event_uuid: createNotificationTelemetriDto.event_uuid,
      client_uuid: createNotificationTelemetriDto.client_uuid,
      event_date: Date.now(), // Fecha de registro del server
      duration: createNotificationTelemetriDto.duration,
    };

    const id_trip = "42a4691f-3f19-4aed-bbd1-2e341b8fb86a";
    const id_unit = "65298909-e732-48db-995b-053b13df00ca";
    const id_trip_log = "c4033825-5974-4830-bd86-11195f9627b1";
    /*
      {
    "id_trip": "42a4691f-3f19-4aed-bbd1-2e341b8fb86a",
    "id_unit": "65298909-e732-48db-995b-053b13df00ca",
    "id_event": "00634e8d-4c2a-49d4-8ff6-bb99e6b15c3b",
    "id_trip_log": "c4033825-5974-4830-bd86-11195f9627b1",
    "register_date": 1727731234
}
    */

    const createAlertDto: CreateAlertDto = {
      _id: uuid.v4(),
      id_trip: id_trip,
      id_unit: id_unit,
      id_event: createNotificationTelemetriDto.event_uuid,
      id_trip_log: id_trip_log,
      register_date: createNotificationTelemetriDto.datetime
    }

    try {
      //return mappedAlert;
      const alert = await firstValueFrom(
        this.client.send({ cmd: 'create-alert' }, { createAlertDto,slug: slug })
      );

      return alert;
    
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: error,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      // Crear el documento en MongoDB
      const notification = await NotificationsHistory.create(mappedData);
      //return notification;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: 'Error al crear notification history',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async createGeofenceTelemetry(createNotificationGeofencesDto: CreateNotificationsGeofencesDto, slug: string) {
    //return createNotificationTelemetriDto;
    const { location } = createNotificationGeofencesDto as any; // Usar "any" para manejar objetos anidados no declarados directamente en el DTO
    const { lat: latitude, lon: longitude } = location; // Renombrar campos a "latitude" y "longitude"

    // Establecer conexión a la base de datos según el slug
    const dbConnection = await this.dbManager.getMongoConnection(slug);
    const NotificationsGeofences = dbConnection.model('geofences_telemetry', geofencesTelemetrySchema);
    const uuid = require('uuid');

    try {
      await firstValueFrom(
        this.client.send({ cmd: 'find-one-event' }, { id: createNotificationGeofencesDto.event_uuid,slug: slug  })
      );
    }
    catch (error) {
      throw new RpcException({
        message: `El evento ${createNotificationGeofencesDto.event_uuid} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      await firstValueFrom(
        this.client.send({ cmd: 'find-one-client' }, { id: createNotificationGeofencesDto.client_uuid,slug: slug })
      );
    }
    catch (error) {
      throw new RpcException({
        message: `El Client ${createNotificationGeofencesDto.client_uuid} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    /*
    const geofencesTelemetrySchema = new Schema({
    _id: { type: String, required: true },
    event_type: { type: String, required: true },
    id_device: { type: Number, required: true },
    geofence: { type: String, required: true },
    datetime: { type: Number, required: true },
    event_uuid: { type: String, required: true },    
    client_uuid: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    event_date: { type: Number, required: true },    

});
    */
    //TRIP ID
    //42a4691f-3f19-4aed-bbd1-2e341b8fb86a
    // Mapear los datos al esquema de MongoDB
    const mappedData = {
      _id: uuid.v4(), // Genera un UUID único
      event_type: createNotificationGeofencesDto.event_type, 
      id_device: createNotificationGeofencesDto.id_device,
      geofence: createNotificationGeofencesDto.geofence, 
      datetime: createNotificationGeofencesDto.datetime,
      event_uuid: createNotificationGeofencesDto.event_uuid,
      client_uuid: createNotificationGeofencesDto.client_uuid,
      latitude, // Asignar el valor extraído directamente
      longitude, // Asignar el valor extraído directamente
      event_date: Date.now(), // Fecha de registro del server
    };

    const id_trip = "42a4691f-3f19-4aed-bbd1-2e341b8fb86a";
    const id_unit = "65298909-e732-48db-995b-053b13df00ca";
    const id_trip_log = "c4033825-5974-4830-bd86-11195f9627b1";
    /*
      {
    "id_trip": "42a4691f-3f19-4aed-bbd1-2e341b8fb86a",
    "id_unit": "65298909-e732-48db-995b-053b13df00ca",
    "id_event": "00634e8d-4c2a-49d4-8ff6-bb99e6b15c3b",
    "id_trip_log": "c4033825-5974-4830-bd86-11195f9627b1",
    "register_date": 1727731234
}
    */

    const createAlertDto: CreateAlertDto = {
      _id: uuid.v4(),
      id_trip: id_trip,
      id_unit: id_unit,
      id_event: createNotificationGeofencesDto.event_uuid,
      id_trip_log: id_trip_log,
      register_date: createNotificationGeofencesDto.datetime
    }

    try {
      //return mappedAlert;
      const alert = await firstValueFrom(
        this.client.send({ cmd: 'create-alert' }, { createAlertDto,slug: slug })
      );

      return alert;
    
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: error,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      // Crear el documento en MongoDB
      const notification = await NotificationsGeofences.create(mappedData);
      //return notification;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: 'Error al crear notification history',
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

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getMongoConnection(slug);
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
          id_event: notification.id_event,
          slug: slug
        });
  
        return {
          id_notification: notification?._id,
          trip: trip,
          unit: unit,
          trip_log: trip_log,
          event: event,
          alert_time: notification?.register_date.toString(),
          type: 'event'
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

  async findAllByTrips(paginationDto: PaginationDto, slug) {
    const dbConnection = await this.dbManager.getMongoConnection(slug);
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
    
      const { unit, trip, trip_log } = await this.getMicroservicesData({ 
        id_unit: oldestNotification?.id_unit, 
        id_trip: oldestNotification?.id_trip, 
        id_trip_log: mostRecentNotification?.id_trip_log, 
        slug: slug 
      });
    
      return {
        trip: trip,
        unit: unit?.name,
        situation: trip_log.situation?.name,
        status: trip_log.status?.name,
        alert_time: oldestNotification?.register_date.toString(),
        active_alerts: notification?.totalNotifications,
        type: 'trip'
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

  async findOne(id_notification: string, slug: string) {
    const dbConnection = await this.dbManager.getMongoConnection(slug);
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
      id_event: id_event,
      slug: slug
    });

    return {
      id_notification: alert._id,
      unit,
      trip,
      event,
      trip_log
    };
  }

  async update(id_notification: string, updateAlertDto: UpdateAlertDto, slug: string) {
    const dbConnection = await this.dbManager.getMongoConnection(slug);
    const Notifications = dbConnection.model('notifications', notificationsSchema);

    await this.findOne(id_notification, slug);

    const data = { ...updateAlertDto };
    
    await Notifications.updateOne(
      { _id: id_notification },
      { ...data }
    );

    return this.findOne(id_notification, slug);
  }

  async close_alert(closeAlertDto: CloseAlertDto, slug: string) {
    const dbConnection = await this.dbManager.getMongoConnection(slug);
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
      id_event: id_event,
      slug: slug
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

      return this.findOne(id_notification, slug);
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
    slug,
  }: {
    id_unit?: string;
    id_trip?: string;
    id_trip_log?: string;
    id_event?: any;
    slug: string;
  }): Promise<any> {
    const result: any = {};
  
    if (id_unit) {
      try {
        result.unit = await firstValueFrom(
          this.client.send({ cmd: 'find-one-unit' }, { id: id_unit, slug: slug })
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
          this.client.send({ cmd: 'find-one-trip' }, { id: id_trip, slug: slug })
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
          this.client.send({ cmd: 'find-one-trip-log' }, { id: id_trip_log, slug: slug })
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
          this.client.send({ cmd: 'find-one-event' }, { id: id_event, slug: slug })
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
