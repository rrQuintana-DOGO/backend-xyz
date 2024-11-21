import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTimeZoneDto } from '@timezones/dto/create-time_zone.dto';
import { UpdateTimeZoneDto } from '@timezones/dto/update-time_zone.dto';
import { PaginationDto } from '@common/index';
import { RpcException } from '@nestjs/microservices';
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class TimeZonesService {
  private readonly logger = new Logger(TimeZonesService.name);

  constructor(
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async create(createTimeZoneDto: CreateTimeZoneDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);
    
    try {
      return dbConnection.time_zones.create({
        data: createTimeZoneDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: 'Error al crear la zona horaria',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit } = paginationDto;

    const totalPages = await dbConnection.time_zones.count();
    const lastPage = limit > 0 ? Math.ceil(totalPages / limit) : 1;
    validatePageAndLimit(page, lastPage);

    const time_zoness = await dbConnection.time_zones.findMany({
      skip: limit > 0 ? (page - 1) * limit : undefined,
      take: limit > 0 ? limit : undefined,
    });
  
    return {
      data: time_zoness,
      meta: {
        total_records: totalPages,
        current_page: page,
        total_pages: limit > 0 ? lastPage : 1,
      },
    };
  }

  async findOne(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const time_zones = await dbConnection.time_zones.findUnique({
      where: { id_time_zone: id },
    });

    if (!time_zones) {
      throw new RpcException({
        message: `No se encontró la zona horaria con id ${id}`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return time_zones;
  }

  async update(id: string, updateDeviceTypeDto: UpdateTimeZoneDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { id_time_zone: __, ...data } = updateDeviceTypeDto;
    await this.findOne(id, slug);

    try {
      return dbConnection.time_zones.update({
        where: { id_time_zone: id },
        data: updateDeviceTypeDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al actualizar la zona horaria con id ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try {
      return dbConnection.time_zones.delete({
        where: { id_time_zone: id },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al eliminar la zona horaria con id ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
