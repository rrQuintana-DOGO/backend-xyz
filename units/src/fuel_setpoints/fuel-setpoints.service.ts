import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
//import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateFuelSetpointDto } from '@fuel_setpoints/dto/create-fuel-setpoint.dto';
import { UpdateFuelSetpointDto } from '@fuel_setpoints/dto/update-fuel-setpoint.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from '@app/common';
import { RpcException,ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from '@app/config';
import { firstValueFrom } from 'rxjs';
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { FuelSetpoint } from '@fuel_setpoints/entities/fuel-setpoint.entity';
import { DeviceTypeService } from '@app/devices_type/device-types.service';
@Injectable()
export class FuelSetpointsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(FuelSetpointsService.name);

  onModuleInit() {
    this.$connect();
    this.logger.log('Fuel setpoint Service Connected to the database');
  }
  
  constructor(
    @Inject(NATS_SERVICE) 
    private readonly clientUnits: ClientProxy)
     
    {
      super();
  }
    
  

 
 
  async validateUnitMeasurement(id_unit_measure: string): Promise<void> {
    try {
      const unit_measurement = await firstValueFrom(
        this.clientUnits.send('findOneUnitMeasurement', { id: id_unit_measure })
      );
      if (!unit_measurement) {
        throw new RpcException({
          message: `El id_unit_measure ${id_unit_measure} no fue encontrado`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    } catch (error) {
      this.logger.error(`El id_unit_measure ${id_unit_measure} no fue encontrado`);
      throw new RpcException({
        message: `El id_unit_measure ${id_unit_measure} no fue encontrado`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
 
  // Función para validar si existe un id_place_type

  async create(createFuelSetpointDto: CreateFuelSetpointDto) {
    //validateUnitMeasurement
    await this.validateUnitMeasurement(createFuelSetpointDto.id_unit_measure);
    try { 
      return this.fuel_setpoints.create({
        data: createFuelSetpointDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al crear el tipo de setpoint de combustible ${createFuelSetpointDto.setpoint}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
    
}

  
  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const totalPages = await this.fuel_setpoints.count({where: {status:true}});
      const lastPage = Math.ceil(totalPages / limit);

      validatePageAndLimit(page, lastPage);

      const fuelsetpoint = await this.fuel_setpoints.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { status: true },
        include: { unit_measurements: true
        },
      });

      return {
        data: fuelsetpoint,
        meta: {
          total_records: totalPages,
          current_page: page,
          total_pages: lastPage,
        },
      };
    } catch (error) {
      this.logger.error(error);
      const message =  error.message || 'Error al obtener los lugares';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async findOne(id: string) {
    const fuelsetpoint = await this.fuel_setpoints.findUnique({
      where: { id_fuel_setpoint: id, status:true},
      include: { unit_measurements: true
                },
      });

    if (!fuelsetpoint) {
      this.logger.error(`Fuel Setpoint con id ${id} no encontrado`);
      throw new RpcException({
        message: `Fuel Setpoint con id ${id} no encontrado`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return fuelsetpoint;
  }
  
  /*
  async update(id_fuel_setpoint: string, updateFuelSetpointDto: UpdateFuelSetpointDto) {
    await this.validateUnitMeasurement(updateFuelSetpointDto.id_unit_measure);

    try { 
      await this.fuel_setpoints.update({
        where: { id_fuel_setpoint: id_fuel_setpoint, status: true },
        data: updateFuelSetpointDto,
      });
      return this.findOne(id_fuel_setpoint);
  } catch (error) {
    this.logger.error(error);
    throw new RpcException({
      message: `Error al actualizar el tipo de setpoint de combustible ${updateFuelSetpointDto.setpoint}`,
      status: HttpStatus.BAD_REQUEST,
    });
  }
  }
  */

  
  async update(id: string, updateFuelSetpointDto: UpdateFuelSetpointDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id_fuel_setpoint: __, ...data } = updateFuelSetpointDto;    
    await this.findOne(id);
    await this.validateUnitMeasurement(updateFuelSetpointDto.id_unit_measure);

    try{
      return this.fuel_setpoints.update({
        where: { id_fuel_setpoint: id, status: true },
        data: updateFuelSetpointDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al actualizar el tipo de setpoint de combustible ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

 
  async remove(id: string) {
    await this.findOne(id);
    return this.fuel_setpoints.update({
      where: { id_fuel_setpoint: id },
      data: { status: false },
    });
  }

}
