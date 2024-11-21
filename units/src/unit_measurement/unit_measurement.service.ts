import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUnitMeasurementDto } from '@unit_measurement/dto/create-unit_measurement.dto';
import { UpdateUnitMeasurementDto } from '@unit_measurement/dto/update-unit_measurement.dto';
import { PaginationDto } from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class UnitMeasurementService {
  private readonly logger = new Logger(UnitMeasurementService.name);

  constructor(
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async create(createUnitMeasurementDto: CreateUnitMeasurementDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      return await dbConnection.unit_measurements.create({
        data: createUnitMeasurementDto,
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Ocurrió un error al crear la unidad de medida',
      });
    }
  }

  async findAll(slug: string, paginationDto?: PaginationDto) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const { page = 1, limit = Number.MAX_SAFE_INTEGER } = paginationDto || {};

      const pageNumber = Math.max(page, 1);
      const limitNumber = Math.max(limit, 1);

      const totalRecords = await dbConnection.unit_measurements.count();

      const effectiveLimit =
        limitNumber > 0 ? limitNumber : Number.MAX_SAFE_INTEGER;

      const lastPage = Math.ceil(totalRecords / effectiveLimit);

      if (pageNumber > lastPage) {
        throw new RpcException({
          message: `La página ${pageNumber} no existe`,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      const unitMeasurements = await dbConnection.unit_measurements.findMany({
        skip: (pageNumber - 1) * effectiveLimit,
        take: effectiveLimit,
      });

      return {
        data: unitMeasurements,
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
        message: 'Ocurrió un error al obtener las unidades de medida',
      });
    }
  }

  async findOne(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const unitMeasurement = await dbConnection.unit_measurements.findUnique({
        where: { id_unit_measurement: id },
      });

      if (!unitMeasurement) {
        throw new RpcException({
          message: `La unidad de medida con id ${id} no existe`,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      return unitMeasurement;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Ocurrió un error al buscar la unidad de medida con id ${id}`,
      });
    }
  }

  async update(id: string, updateUnitMeasurementDto: UpdateUnitMeasurementDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);
    
    try {
      await this.findOne(id, slug);

      return await dbConnection.unit_measurements.update({
        where: { id_unit_measurement: id },
        data: updateUnitMeasurementDto,
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Ocurrió un error al actualizar la unidad de medida con id ${id}`,
      });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const unitMeasurement = await this.findOne(id, slug);

      unitMeasurement.status = false;

      return await dbConnection.unit_measurements.update({
        where: { id_unit_measurement: id },
        data: unitMeasurement,
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Ocurrió un error al eliminar la unidad de medida con id ${id}`,
      });
    }
  }
}
