import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';
import { PaginationDto } from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { Carrier } from '@carriers/entities/carrier.entity';
import { DataBaseManagerService } from '@app/db_manager/db_manager.service';

@Injectable()
export class CarriersService {
  private readonly logger = new Logger(CarriersService.name);

  constructor(
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async create(createCarrierDto: CreateCarrierDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      return await dbConnection.carriers.create({
        data: createCarrierDto,
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Ocurrió un error al crear el transportista',
      });
    }
  }

  async validateCarriersExist(carriers: string[], field: string = 'id_carrier', slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);
    const nonExistentCarriers: string[] = [];
    const existentCarriers: Partial<Carrier>[] = [];

    for (const carrier of carriers) {
      const carrierExist = await dbConnection.carriers.findFirst({
        where: { [field]: carrier, status: true },
        select: { id_carrier: true, name: true },
      });

      if (!carrierExist) {
        nonExistentCarriers.push(carrier);
      } else {
        existentCarriers.push(carrierExist);
      }
    }

    if (nonExistentCarriers.length > 0) {
      throw new RpcException({
        message: nonExistentCarriers.toString(),
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return existentCarriers;
  }

  async findAll(slug: string, paginationDto?: PaginationDto) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const { page = 1, limit = Number.MAX_SAFE_INTEGER } = paginationDto || {};
      const pageNumber = Math.max(page, 1);
      const limitNumber = Math.max(limit, -1);

      const totalRecords = await dbConnection.carriers.count();
      const effectiveLimit =
        limitNumber < 0
          ? totalRecords
          : limitNumber > 0
            ? limitNumber
            : Number.MAX_SAFE_INTEGER;
      const lastPage = Math.ceil(totalRecords / effectiveLimit);

      if (pageNumber > lastPage && lastPage > 0) {
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: 'La página solicitada no existe',
        });
      }

      const carriers = await dbConnection.carriers.findMany({
        where: { status: true },
        skip: (pageNumber - 1) * effectiveLimit,
        take: effectiveLimit,
      });

      return {
        data: carriers,
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
        message: 'Ocurrió un error al obtener los transportistas',
      });
    }
  }

  async findOne(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const carrier = await dbConnection.carriers.findUnique({
        where: { id_carrier: id },
      });

      if (!carrier) {
        throw new RpcException({
          message: `El transportista con id ${id} no existe`,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      return carrier;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Ocurrió un error al buscar el transportista con id ${id}`,
      });
    }
  }

  async update(id: string, updateCarrierDto: UpdateCarrierDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const { id_carrier: ___, ...data } = updateCarrierDto;
      await this.findOne(id, slug);

      return await dbConnection.carriers.update({
        where: { id_carrier: id },
        data,
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Ocurrió un error al actualizar el transportista con id ${id}`,
      });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const carrier = await this.findOne(id, slug);
      carrier.status = false;

      return await dbConnection.carriers.update({
        where: { id_carrier: id },
        data: carrier,
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Ocurrió un error al eliminar el transportista con id ${id}`,
      });
    }
  }
}
