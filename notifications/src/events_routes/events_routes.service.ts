import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateEventsRouteDto } from '@event_routes/dto/create-events_route.dto';
import { UpdateEventsRouteDto } from '@event_routes/dto/update-events_route.dto';
import { PaginationDto } from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { DataBaseManagerService } from '@app/db_manager/db_manager.service';

@Injectable()
export class EventsRoutesService {
  private readonly logger = new Logger(EventsRoutesService.name);

  constructor(
    private readonly dbManager: DataBaseManagerService
  ) {}

  async create(createEventsRouteDto: CreateEventsRouteDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const { event_type, ...rest } = createEventsRouteDto;

      const eventTypeExists = await dbConnection.event_types.findUnique({
        where: { id_event_type: event_type },
      });

      if (!eventTypeExists) {
        throw new RpcException({
          message: `El tipo de evento con id ${event_type} no existe`,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      return await dbConnection.events_routes.create({
        data: {
          ...rest,
          event_types: {
            connect: { id_event_type: event_type },
          },
        },
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Ocurrió un error al crear la ruta de evento',
      });
    }
  }

  async findAll(slug: string, paginationDto?: PaginationDto) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const { page = 1, limit = Number.MAX_SAFE_INTEGER } = paginationDto || {};

      const pageNumber = Math.max(page, 1);
      const limitNumber = Math.max(limit, 1);

      const totalRecords = await dbConnection.events_routes.count();

      const effectiveLimit =
        limitNumber > 0 ? limitNumber : Number.MAX_SAFE_INTEGER;

      const lastPage = Math.ceil(totalRecords / effectiveLimit);

      const events_routes = await dbConnection.events_routes.findMany({
        skip: (pageNumber - 1) * effectiveLimit,
        take: effectiveLimit,
      });

      return {
        data: events_routes,
        meta: {
          total_records: totalRecords,
          current_page: paginationDto ? pageNumber : 1,
          total_pages: paginationDto ? lastPage : 1,
        },
      };
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Ocurrió un error al obtener las rutas de eventos',
      });
    }
  }

  async findOne(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const eventsRoute = await dbConnection.events_routes.findUnique({
        where: { id_event_route: id },
      });

      if (!eventsRoute) {
        throw new RpcException({
          message: `La ruta de evento con id ${id} no existe`,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      return eventsRoute;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Ocurrió un error al buscar la ruta de evento con id ${id}`,
      });
    }
  }

  async update(id: string, updateEventsRouteDto: UpdateEventsRouteDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      await this.findOne(id, slug);

      return await dbConnection.events_routes.update({
        where: { id_event_route: id },
        data: updateEventsRouteDto,
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Ocurrió un error al actualizar la ruta de evento con id ${id}`,
      });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const event_route = await this.findOne(id, slug);

      event_route.status = false;

      return await dbConnection.events_routes.update({
        where: { id_event_route: id },
        data: event_route,
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Ocurrió un error al eliminar la ruta de evento con id ${id}`,
      });
    }
  }
}
