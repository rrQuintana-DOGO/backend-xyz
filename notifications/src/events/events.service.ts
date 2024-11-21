import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateEventDto } from '@events/dto/create-events.dto';
import { UpdateEventDto } from '@events/dto/update-events.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from '@common/index';
import { RpcException } from '@nestjs/microservices';
import { Event } from '@events/entities/events.entity';
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class EventsService extends PrismaClient {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private readonly dbManager: DataBaseManagerService,
  ) {
    super();
  }

  async create(createEventDto: CreateEventDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug); // Asegúrate de que la conexión esté activa

    try{
      return dbConnection.events.create({
        data: createEventDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({ 
        message: 'Error al crear el evento',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async validateEventsExist(events: string[], field: string = 'id_event', slug: string) {
        
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const nonExistentEvents: string[] = [];
    const existentEvents: Partial<Event>[] = [];

    for (const event of events) {
      const eventExist = await dbConnection.events.findFirst({
        where: { [field]: event, status: true },
        select: { id_event: true, name: true },
      });

      if (!eventExist) {
        nonExistentEvents.push(event);
      } else {
        existentEvents.push(eventExist);
      }
    }

    if (nonExistentEvents.length > 0) {
      throw new RpcException({
        message: nonExistentEvents.toString(),
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return existentEvents;
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit } = paginationDto;
    
    try{
    const totalPages = await dbConnection.events.count({
        where: { status: true },
      });

      const lastPage = Math.ceil(totalPages / limit);

      validatePageAndLimit(page, lastPage);

      const events = await dbConnection.events.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { status: true },
      });

      return {
        data: events,
        meta: {
          total_records: totalPages,
          current_page: page,
          total_pages: lastPage,
        },
      };
    } catch (error) {
      this.logger.error(error);
      const message =  error.message || 'Error al obtener los eventos';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async findOne(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const event = await dbConnection.events.findUnique({
      where: { id_event: id, status: true },
    });

    if (!event) {
      this.logger.error(`No se encontró el evento con el id: ${id}`);
      throw new RpcException({
        message: `No se encontró el evento con el id: ${id}`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return event;
  }

  async update(id: string, updateDeviceTypeDto: UpdateEventDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { id_event: __, ...data } = updateDeviceTypeDto;    
    await this.findOne(id, slug);

    try{
      return dbConnection.events.update({
        where: { id_event: id },
        data: updateDeviceTypeDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({ 
        message: `Error al actualizar el evento con el id: ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try{
      return dbConnection.events.update({
        where: { id_event: id },
        data: { status: false },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({ 
        message: `Error al eliminar el evento con el id: ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findEventsByIds(events: string[], slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const events_data = [];
    const nonExistUnits = []

    for (const event of events) {
      const event_data = await dbConnection.events.findUnique({
        where: { id_event: event },
      });

      if (!event_data) {
        nonExistUnits.push(event);
      }
      else {
        events_data.push(event_data);
      }
    }

    if (nonExistUnits.length > 0) {
      throw new RpcException({
        message: `Los siguientes events no existen: ${nonExistUnits.join(', ')}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return events_data;
  }
}
