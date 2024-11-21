import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateFuelTypeDto } from '@fuel_types/dto/create-fuel-type.dto';
import { UpdateFuelTypeDto } from '@fuel_types/dto/update-fuel-type.dto';
import { PaginationDto } from '@common/index';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from '@app/config';
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class FuelTypeService {
  private readonly logger = new Logger(FuelTypeService.name);

  constructor(
    @Inject(NATS_SERVICE) 
    private readonly clientTravelPlanning: ClientProxy,
    private readonly dbManager: DataBaseManagerService,
  )  {}

  async create(createFuelTypeDto: CreateFuelTypeDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try{
      const id_unit_measurement = await firstValueFrom(
        this.clientTravelPlanning.send({ cmd: 'find-one-unit-measurement' }, { id: createFuelTypeDto.id_unit_measurement, slug: slug })
      );   
    } catch {
      this.logger.error(`El id_unit_measurement ${createFuelTypeDto.id_unit_measurement} no fue encontrado`);

      throw new RpcException({
        message: `El id_unit_measurement ${createFuelTypeDto.id_unit_measurement} no fue encontrado`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try { 
      return dbConnection.fuel_types.create({
        data: createFuelTypeDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al crear el tipo de combustible ${createFuelTypeDto.name}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit } = paginationDto;

    try {
      const totalPages = await dbConnection.fuel_types.count();
      const lastPage = Math.ceil(totalPages / limit);

      validatePageAndLimit(page, lastPage);

      const fuel = await dbConnection.fuel_types.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { status: true },
      });

      return {
        data: fuel,
        meta: {
          total_records: totalPages,
          current_page: page,
          total_pages: lastPage,
        },
      };
    } catch (error) {
      this.logger.error(error);
      const message =  error.message || 'Error al obtener tipos de combustible';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  

  async findOne(id: string, slug: string, status = true) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const fuel_type = await dbConnection.fuel_types.findUnique({
      where: { id_fuel_type: id, status },
    });

    if (!fuel_type) {
      this.logger.error(`Tipo de combustible con id ${id} no encontrado`);
      throw new RpcException({
        message: `Tipo de combustible con id ${id} no encontrado`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return fuel_type;
  }

  async update(id: string, updateFuelTypeDto: UpdateFuelTypeDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    if (updateFuelTypeDto.id_unit_measurement) {
      try{
        const id_unit_measurement = await firstValueFrom(
          this.clientTravelPlanning.send(
            { cmd: 'findOneUnitMeasurement' }, 
            { id: updateFuelTypeDto.id_unit_measurement, slug: slug }
          )
        );   
      }catch{
        this.logger.error(`El id_unit_measurement ${updateFuelTypeDto.id_unit_measurement} no fue encontrado`);
        throw new RpcException({
          message: `El id_unit_measurement ${updateFuelTypeDto.id_unit_measurement} no fue encontrado`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }
     
    try { 
      await dbConnection.fuel_types.update({
        where: { id_fuel_type: id, status: true },
        data: updateFuelTypeDto,
      });
      return this.findOne(id, slug);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al actualizar el tipo de combustible ${updateFuelTypeDto.name}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  
  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try {
      return dbConnection.fuel_types.update({
        where: { id_fuel_type: id },
        data: { status: false },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al eliminar el tipo de combustible ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}