import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateEventConfDto } from '@eventsconfig/dto/create-conf_events.dto';
import { UpdateEventConfDto } from '@eventsconfig/dto/update-conf_events.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from '@common/index';
import { RpcException } from '@nestjs/microservices';
import { EventsService } from '@events/events.service';
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class EventsConfService extends PrismaClient {
  private readonly logger = new Logger(EventsConfService.name);

  constructor(
    private readonly eventsService: EventsService,
    private readonly dbManager: DataBaseManagerService,
  ) {
    super();
  }

  async create(createEventConfigDto: CreateEventConfDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.eventsService.findOne(createEventConfigDto.id_event, slug);

    return dbConnection.conf_event.create({
      data: createEventConfigDto,
    });
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit } = paginationDto;

    try{

      const totalPages = await dbConnection.conf_event.count({
        where: { status: true },
      });
      const lastPage = Math.ceil(totalPages / limit);

      validatePageAndLimit(page, lastPage);

      const conf_event = await dbConnection.conf_event.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { status: true },
        include: {
          events: true
        },
      });

      return {
        data: conf_event,
        meta: {
          total_records: totalPages,
          current_page: page,
          total_pages: lastPage,
        },
      };
    } catch (error) {
      this.logger.error(error);
      const message =  error.message || 'Error al obtener las configuraciones de eventos';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async findOne(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const event = await dbConnection.conf_event.findUnique({
      where: { id_conf_event: id, status: true },
      include: {
        events: true,
      },
    });

    if (!event) {
      this.logger.error(`El evento con id: ${id} no existe`);
      throw new RpcException({
        message: `El evento con id: ${id} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return event;
  }

  async update(id: string, updateDeviceTypeDto: UpdateEventConfDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { id_conf_event: __, ...data } = updateDeviceTypeDto;

    await this.findOne(id, slug);
    await this.eventsService.findOne(updateDeviceTypeDto.id_event, slug);
    
    try{

      await dbConnection.conf_event.update({
        where: { id_conf_event:id },
        data: updateDeviceTypeDto,
      });

      return this.findOne(id, slug);

    } catch (error) {
      this.logger.error(error);
      throw new RpcException({ message: `Ocurrio un error al actualizar la configuración del evento con id:  ${id}`});
    }

  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try{
      return dbConnection.conf_event.update({
        where: { id_conf_event: id },
        data: { status: false },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({ message: `Ocurrio un error al elminar la configuración del evento con id: ${id}`});
    }
  }
}
