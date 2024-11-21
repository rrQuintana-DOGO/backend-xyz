import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PaginationDto } from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { CreateLiscencesTypeDto } from '@liscences_types/dto/create-liscences_type.dto';
import { UpdateLiscencesTypeDto } from '@liscences_types/dto/update-liscences_type.dto';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class LiscencesTypesService {
  private readonly logger = new Logger(LiscencesTypesService.name);

  constructor(
    private readonly dbManager: DataBaseManagerService
  ) {}

  async create(createLicencesTypeDto: CreateLiscencesTypeDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      return await dbConnection.license_types.create({
        data: createLicencesTypeDto,
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Ocurrió un error al crear el tipo de licencia',
      });
    }
  }

  async findAll(slug: string, paginationDto?: PaginationDto) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const { page = 1, limit = Number.MAX_SAFE_INTEGER } = paginationDto || {};
      const pageNumber = Math.max(page, 1);
      const limitNumber = Math.max(limit, 1);

      const totalRecords = await dbConnection.license_types.count({
        where: { status: true },
      });

      const effectiveLimit =
        limitNumber > 0 ? limitNumber : Number.MAX_SAFE_INTEGER;
      const lastPage = Math.ceil(totalRecords / effectiveLimit);

      if (pageNumber > lastPage) {
        throw new RpcException({
          message: `La página ${pageNumber} no fue encontrada`,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      const licencesTypes = await dbConnection.license_types.findMany({
        where: { status: true },
        skip: (pageNumber - 1) * effectiveLimit,
        take: effectiveLimit,
      });

      return {
        data: licencesTypes,
        meta: {
          total_records: totalRecords,
          current_page: pageNumber,
          total_pages: lastPage,
        },
      };
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Ocurrió un error al obtener los tipos de licencia',
      });
    }
  }

  async findOne(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const licencesType = await dbConnection.license_types.findUnique({
        where: { id_license_type: id },
      });

      if (!licencesType) {
        throw new RpcException({
          message: `El tipo de licencia con id ${id} no existe`,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      return licencesType;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Ocurrió un error al buscar el tipo de licencia con id ${id}`,
      });
    }
  }

  async update(id: string, updateLicencesTypeDto: UpdateLiscencesTypeDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const { id_license: __, ...data } = updateLicencesTypeDto;
      await this.findOne(id, slug);

      return await dbConnection.license_types.update({
        where: { id_license_type: id },
        data,
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Ocurrió un error al actualizar el tipo de licencia con id ${id}`,
      });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const licencesType = await this.findOne(id, slug);
      licencesType.status = false;

      return await dbConnection.license_types.update({
        where: { id_license_type: id },
        data: licencesType,
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Ocurrió un error al eliminar el tipo de licencia con id ${id}`,
      });
    }
  }
}
