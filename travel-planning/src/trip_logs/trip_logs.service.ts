import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from '@app/config';
import { CreateTripLogDto } from './dto/create-trip_logs.dto';
import { tripLogsSchema } from '@mongo/models/trip_logs.model';
import { firstValueFrom } from 'rxjs';
import { SituationsService } from '@app/situations/situations.service';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class TripLogsService {
  private readonly logger = new Logger(TripLogsService.name);

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly situationsService: SituationsService,
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async create(createTripLogsDto: CreateTripLogDto, slug: string) {
    const dbConnection = await this.dbManager.getMongoConnection(slug);
    const TripLogs = dbConnection.model('trip_logs', tripLogsSchema);

    const { id_trip, id_status, id_situation, id_user } = createTripLogsDto;

    try {
      await firstValueFrom(
        this.client.send({ cmd: 'find-one-trip' }, { id: id_trip })
      );
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      const user = await firstValueFrom(
        this.client.send({ cmd: 'find-one-user' }, { id: id_user })
      );
    }
    catch (error) {
      throw new RpcException({
        message: `El user ${id_user} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      const status = await firstValueFrom(
        this.client.send({ cmd: 'find-one-status' }, { id: id_status })
      );
    }
    catch (error) {
      throw new RpcException({
        message: `El status ${id_status} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      const situation = await firstValueFrom(
        this.client.send({ cmd: 'find-one-situation' }, { id: id_situation })
      );
    }
    catch (error) {
      throw new RpcException({
        message: `La situation ${id_situation} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      const trip_log = await TripLogs.create(createTripLogsDto);

      return this.findOne(trip_log._id, slug);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: 'Error al crear el viaje',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findFinishedTrips(slug: string) {
    const dbConnection = await this.dbManager.getMongoConnection(slug);
    const TripLogs = dbConnection.model('trip_logs', tripLogsSchema);

    const eightHoursAgo = Math.floor(Date.now() / 1000) - 8 * 60 * 60;
    const id_completed_situation = await this.situationsService.validateSituationsExist(['TC'], 'name', slug);
    
    try {
      const trips = await TripLogs.aggregate([
        {
          $match: {
            created_at: { $gte: eightHoursAgo },
            id_situation: id_completed_situation[0].id_situation
          }
        },
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
        message: 'Error al obtener los viajes finalizados',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findLogsById(id: string, slug: string) {
    const dbConnection = await this.dbManager.getMongoConnection(slug);
    const TripLogs = dbConnection.model('trip_logs', tripLogsSchema);

    try {
      const trip = await firstValueFrom(
        this.client.send({ cmd: 'find-one-trip' }, { id: id })
      );
    }
    catch (error) {
      throw new RpcException({
        message: `El viaje ${id} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const logs = await TripLogs.find({
      id_trip: id
    });

    const trip_logs = await Promise.all(logs.map(log => this.findOne(log._id, slug)));

    return trip_logs;
  }

  async findOne(id: string, slug:string) {
    const dbConnection = await this.dbManager.getMongoConnection(slug);
    const TripLogs = dbConnection.model('trip_logs', tripLogsSchema);

    let trip, status, situation, user, trip_log;

    try {
      trip_log = await TripLogs.findOne({ _id: id });
    }
    catch (error) {
      throw new RpcException({
        message: `El log ${id} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const { id_trip, id_status, id_situation, id_user } = trip_log;

    try {
      trip = await firstValueFrom(
        this.client.send({ cmd: 'find-one-trip' }, { id: id_trip })
      );
    }
    catch (error) {
      throw new RpcException({
        message: `El viaje ${id_trip} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      user = await firstValueFrom(
        this.client.send({ cmd: 'find-one-user' }, { id: id_user })
      );
    }
    catch (error) {
      throw new RpcException({
        message: `El user ${id_user} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      status = await firstValueFrom(
        this.client.send({ cmd: 'find-one-status' }, { id: id_status })
      );
    }
    catch (error) {
      throw new RpcException({
        message: `El status ${id_status} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      situation = await firstValueFrom(
        this.client.send({ cmd: 'find-one-situation' }, { id: id_situation })
      );
    }
    catch (error) {
      throw new RpcException({
        message: `La situation ${id_situation} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return {
      id_trip_log: trip_log._id,
      trip,
      user,
      status,
      situation,
      created_at: trip_log.created_at
    };
  }
}
