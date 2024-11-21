import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { PaginationDto } from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { Driver } from './entities/driver.entity';
import { DataBaseManagerService } from '@app/db_manager/db_manager.service';

@Injectable()
export class DriversService {
  private readonly logger = new Logger(DriversService.name);

  constructor(
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async create(createDriverDto: CreateDriverDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const driverData = {
        ...createDriverDto,
        license_types: createDriverDto.license_types
          ? {
              connect: {
                id_license_type: createDriverDto.license_types,
              },
            }
          : undefined,
        phone: createDriverDto.phone.toString(),
        license_expiration: createDriverDto.license_expiration || undefined,
      };

      return await dbConnection.drivers.create({ data: driverData });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Ocurrió un error al crear el conductor',
      });
    }
  }

  async validateDriversExist(drivers: string[], field: string = 'id_driver', slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const nonExistentDrivers: string[] = [];
    const existentDrivers: Partial<Driver>[] = [];

    for (const driver of drivers) {
      const driverExist = await dbConnection.drivers.findFirst({
        where: { [field]: driver, status: true },
        select: { id_driver: true, name: true },
      });

      if (!driverExist) {
        nonExistentDrivers.push(driver);
      } else {
        existentDrivers.push(driverExist);
      }
    }

    if (nonExistentDrivers.length > 0) {
      throw new RpcException({
        message: nonExistentDrivers.toString(),
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return existentDrivers;
  }

  async findAll(slug: string, paginationDto?: PaginationDto) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const { page = 1, limit = Number.MAX_SAFE_INTEGER } = paginationDto || {};
      const pageNumber = Math.max(page, 1);
      const limitNumber =
        limit === -1 ? Number.MAX_SAFE_INTEGER : Math.max(limit, 1);

      const totalRecords = await dbConnection.drivers.count({
        where: { status: true },
      });

      const lastPage =
        limitNumber > 0 ? Math.ceil(totalRecords / limitNumber) : 1;

      if (limit > 0 && pageNumber > lastPage) {
        throw new RpcException({
          message: `La página ${pageNumber} no fue encontrada`,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      const queryOptions: any = {
        where: { status: true },
      };

      if (limit > 0) {
        queryOptions.skip = (pageNumber - 1) * limitNumber;
        queryOptions.take = limitNumber;
      }

      const drivers = await dbConnection.drivers.findMany(queryOptions);

      return {
        data: drivers,
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
        message: 'Ocurrió un error al obtener los conductores',
      });
    }
  }

  async findOne(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const driver = await dbConnection.drivers.findUnique({
        where: { id_driver: id, status: true },
      });

      if (!driver) {
        throw new RpcException({
          message: `El conductor con id ${id} no existe`,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      return driver;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Ocurrió un error al buscar el conductor con id ${id}`,
      });
    }
  }

  async update(id: string, updateDriverDto: UpdateDriverDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id_driver: __, ...data } = updateDriverDto;
      await this.findOne(id, slug);

      const driverData = {
        ...data,
        phone: data.phone ? data.phone.toString() : undefined,
        license_types: data.license_types
          ? { connect: { id_license_type: data.license_types } }
          : undefined,
      };

      return await dbConnection.drivers.update({
        where: { id_driver: id },
        data: driverData,
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Ocurrió un error al actualizar el conductor con id ${id}`,
      });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const driver = await this.findOne(id, slug);
      driver.status = false;

      return await dbConnection.drivers.update({
        where: { id_driver: id },
        data: driver,
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Ocurrió un error al eliminar el conductor con id ${id}`,
      });
    }
  }
}
