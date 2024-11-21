import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateEventTypeDto } from '@event_types/dto/create-event_type.dto';
import { UpdateEventTypeDto } from '@event_types/dto/update-event_type.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class EventTypesService extends PrismaClient {
  private readonly logger = new Logger(EventTypesService.name);

  constructor(
    private readonly dbManager: DataBaseManagerService,
  ) {
    super();
  }

  async create(createEventTypeDto: CreateEventTypeDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      if (typeof createEventTypeDto.params !== 'object') {
        throw new RpcException({
          message: 'El campo "params" debe ser un objeto JSON válido',
          status: HttpStatus.BAD_REQUEST,
        });
      }

      return await dbConnection.event_types.create({
        data: createEventTypeDto,
      });
    } catch (error) {
      this.logger.error(`Error al crear el tipo de evento: ${error.message}`);
      
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Ocurrió un error al crear el tipo de evento',
      });
    }
  }

  async findAll(slug: string, paginationDto?: PaginationDto) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const { page = 1, limit = Number.MAX_SAFE_INTEGER } = paginationDto || {};
      const pageNumber = Math.max(page, 1);
      const limitNumber = Math.max(limit, 1);

      const totalRecords = await dbConnection.event_types.count();
      const effectiveLimit =
        limitNumber > 0 ? limitNumber : Number.MAX_SAFE_INTEGER;
      const lastPage = Math.ceil(totalRecords / effectiveLimit);

      if (pageNumber > lastPage) {
        throw new RpcException({
          message: `La página ${pageNumber} no existe`,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      const event_types = await dbConnection.event_types.findMany({
        skip: (pageNumber - 1) * effectiveLimit,
        take: effectiveLimit,
      });

      return {
        data: event_types,
        meta: {
          total_records: totalRecords,
          current_page: pageNumber,
          total_pages: lastPage,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error al obtener los tipos de eventos: ${error.message}`,
      );
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Ocurrió un error al obtener los tipos de eventos',
      });
    }
  }

  async findOne(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const event_type = await dbConnection.event_types.findUnique({
        where: { id_event_type: id },
      });

      if (!event_type) {
        throw new RpcException({
          message: `El tipo de evento con id ${id} no existe`,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      return event_type;
    } catch (error) {
      this.logger.error(
        `Error al buscar el tipo de evento con id ${id}: ${error.message}`,
      );
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Ocurrió un error al buscar el tipo de evento con id ${id}`,
      });
    }
  }

  async update(id: string, updateEventTypeDto: UpdateEventTypeDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      await this.findOne(id, slug);

      return await dbConnection.event_types.update({
        where: { id_event_type: id },
        data: updateEventTypeDto,
      });
    } catch (error) {
      this.logger.error(
        `Error al actualizar el tipo de evento con id ${id}: ${error.message}`,
      );
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Ocurrió un error al actualizar el tipo de evento con id ${id}`,
      });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      await this.findOne(id, slug);

      return await dbConnection.event_types.delete({
        where: { id_event_type: id },
      });
    } catch (error) {
      this.logger.error(
        `Error al eliminar el tipo de evento con id ${id}: ${error.message}`,
      );
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Ocurrió un error al eliminar el tipo de evento con id ${id}`,
      });
    }
  }
}
