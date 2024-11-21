import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateDeviceTypeDto } from '@devices_type/dto/create-device-type.dto';
import { UpdateDeviceTypeDto } from '@devices_type/dto/update-device-type.dto';
import { PaginationDto } from '@common/index';
import { RpcException } from '@nestjs/microservices';
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { DataBaseManagerService } from '@app/db_manager/db_manager.service';

@Injectable()
export class DeviceTypeService {
  private readonly logger = new Logger(DeviceTypeService.name);

  constructor (
    private readonly dbManager: DataBaseManagerService
  ) {}

  async create(createDeviceTypeDto: CreateDeviceTypeDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try{
      return dbConnection.device_types.create({
        data: createDeviceTypeDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al crear el tipo de dispositivo ${createDeviceTypeDto.name}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit } = paginationDto;

    try{
      const totalPages = await dbConnection.device_types.count({
        where: { status: true },
      });

      const lastPage = Math.ceil(totalPages / limit);

      validatePageAndLimit(page, lastPage);

      const device_types = await dbConnection.device_types.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { status: true },
      });

      return {
        data: device_types,
        meta: {
          total_records: totalPages,
          current_page: page,
          total_pages: lastPage,
        },
      };
    } catch (error) {
      this.logger.error(error);
      const message =  error.message || 'Error al obtener los tipos de dispositivos';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async findOne(id: string, slug, status = true) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const device_type = await dbConnection.device_types.findUnique({
      where: { id_device_type: id, status },
    });

    if (!device_type) {
      this.logger.error(`Tipo de dispositivo con id ${id} no encontrado`);
      throw new RpcException({
        message: `Tipo de dispositivo con id ${id} no encontrado`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return device_type;
  }

  async update(id: string, updateDeviceTypeDto: UpdateDeviceTypeDto, slug) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { id_device_type: __, ...data } = updateDeviceTypeDto;    
    await this.findOne(id, slug);

    try{
      return dbConnection.device_types.update({
        where: { id_device_type: id },
        data: updateDeviceTypeDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al actualizar el tipo de dispositivo ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try{
      return dbConnection.device_types.update({
        where: { id_device_type: id },
        data: { status: false },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al eliminar el tipo de dispositivo ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
