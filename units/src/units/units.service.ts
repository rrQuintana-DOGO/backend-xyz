import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUnitDto } from '@units/dto/create-unit.dto';
import { UpdateUnitDto } from '@units/dto/update-unit.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from '@app/common';
import { RpcException, ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from '@app/config';
import { firstValueFrom } from 'rxjs';
import { Units } from './entities/unit.entity';
import { validatePageAndLimit } from '@app/common/exceptions/validatePages';
//import { Device } from '@devices/entities/device.entity';
import { DataBaseManagerService } from '@dbManager/db_manager.service';
import { Sign } from 'crypto';

@Injectable()
export class UnitsService {
  private readonly logger = new Logger(UnitsService.name);

  constructor(
    @Inject(NATS_SERVICE)
    private readonly clientUnits: ClientProxy,
    private readonly dbManager: DataBaseManagerService,
  ) { }

  async validateUnitType(unit_type: string, slug: string): Promise<void> {
    try {
      const unitType = await firstValueFrom(
        this.clientUnits.send(
          { cmd: 'find-one-unit-types' },
          { id: unit_type, slug: slug }
        )
      );

      if (!unitType) {
        throw new RpcException({
          message: `El unit_type ${unit_type} no fue encontrado`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    } catch (error) {
      this.logger.error(`El unit_type ${unit_type} no fue encontrado`);
      throw new RpcException({
        message: `El unit_type ${unit_type} no fue encontrado`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async validateDevicesExist(devices: string[], slug: string): Promise<void> {
    const nonExistentDevices: string[] = [];
    const dbConnection = await this.dbManager.getPostgresConnection(slug);
    for (const device of devices) {
      const exists = await dbConnection.devices.findUnique({ where: { id_device: device } });
      if (!exists) {
        nonExistentDevices.push(device);
      }
    }

    if (nonExistentDevices.length > 0) {
      throw new RpcException({
        message: `Los siguientes dispositivos no existen: ${nonExistentDevices.join(', ')}`,
        status: HttpStatus.BAD_REQUEST
      });
    }
  }
  // Función para validar si existe un id_place_type
  async validateFuelType(fuel_types: string, slug: string): Promise<void> {
    try {
      const fuel_type = await firstValueFrom(
        this.clientUnits.send(
          { cmd: 'find-one-fuel-types' },
          { id: fuel_types, slug: slug }
        )
      );

      if (!fuel_type) {
        throw new RpcException({
          message: `El fuel_type ${fuel_type} no fue encontrado`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    } catch (error) {
      this.logger.error(`El fuel_type ${fuel_types} no fue encontrado`);
      throw new RpcException({
        message: `El fuel_type ${fuel_types} no fue encontrado`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async validateFuelSetpoint(fuel_setpoint: string): Promise<void> {
    try {
      const fuel_setpoints = await firstValueFrom(
        this.clientUnits.send('find-one-fuel-setpoint', { id: fuel_setpoint })
      );
      if (!fuel_setpoints) {
        throw new RpcException({
          message: `El fuel_setpoint ${fuel_setpoint} no fue encontrado`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    } catch (error) {
      this.logger.error(`El fuel_setpoint ${fuel_setpoint} no fue encontrado`);
      throw new RpcException({
        message: `El fuel_setpoint ${fuel_setpoint} no fue encontrado`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async verifyPlateExists(plate: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const unit = await dbConnection.units.findFirst({
      where: { plate },
    });

    if (unit) {
      throw new RpcException({
        message: `la placa ${plate} ya existe, este campo debe ser unico`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }


  async validateUnitsExist(units: string[], field: string = 'id_unit', slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const nonExistentUnits: string[] = [];
    const existentUnits: Partial<Units>[] = [];

    for (const unit of units) {
      const unitExist = await dbConnection.units.findFirst({
        where: { [field]: unit, status: true },
        select: { id_unit: true, name: true },
      });

      if (!unitExist) {
        nonExistentUnits.push(unit);
      } else {
        existentUnits.push(unitExist);
      }
    }

    if (nonExistentUnits.length > 0) {
      throw new RpcException({
        message: nonExistentUnits,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return existentUnits;
  }


  async create(createUnitDto: CreateUnitDto, slug: string) {
    if (createUnitDto.fuel_setpoint) {
      await this.validateFuelSetpoint(createUnitDto.fuel_setpoint);
    }
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.validateUnitType(createUnitDto.id_unit_type, slug);
    await this.validateFuelType(createUnitDto.id_fuel_type, slug);
    await this.verifyPlateExists(createUnitDto.plate, slug);

    try {
      return dbConnection.units.create({
        data: {
          name: createUnitDto.name,
          model: createUnitDto.model,
          plate: createUnitDto.plate,
          year: createUnitDto.year,
          status: createUnitDto.status,
          id_unit_type: createUnitDto.id_unit_type,
          id_fuel_type: createUnitDto.id_fuel_type,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al crear la unidad ${createUnitDto.name}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

  }
  /*
  async validatePlacesExist(places: string[]): Promise<void> {
    const nonExistentPlaces: string[] = [];
  
    for (const place of places) {
      const placeExist = await this.places.findUnique({
        where: { id_place: place, status: true },
      });
  
      if (!placeExist) {
        nonExistentPlaces.push(place);
      }
    }
  
    if (nonExistentPlaces.length > 0) {
      throw new RpcException({
        message: `Los siguientes lugares no existen: ${nonExistentPlaces.join(', ')}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
*/
  async findAll(paginationDto: PaginationDto, slug: string) {
    const { page, limit } = paginationDto;
    const dbConnection = await this.dbManager.getPostgresConnection(slug);
    try {
      const totalPages = await dbConnection.units.count({ where: { status: true } });
      const lastPage = Math.ceil(totalPages / limit);

      validatePageAndLimit(page, lastPage);

      let filters = {}

      if (page !== -1) {
        filters = {
          skip: (page - 1) * limit,
          take: limit,
          where: { status: true },
          include: {
            fuel_types: true,
            unit_has_devices: true
          }
        }
      }
      const filter = {
        ...filters,
        where: { status: true },
        include: {
          fuel_types: true,
          unit_has_devices: true
        }

      }
      const units = await dbConnection.units.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { status: true },
        include: {
          fuel_types: true,
          unit_has_devices: true
        }
      });

      return {
        data: units,
        meta: {
          total_records: totalPages,
          current_page: page,
          total_pages: lastPage,
        },
      };
    } catch (error) {
      this.logger.error(error);
      const message = error.message || 'Error al obtener las unidades';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async findOne(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const unit = await dbConnection.units.findUnique({
      where: { id_unit: id, status: true },
      include: {
        fuel_types: true,
        unit_has_devices: true
      },
    });

    if (!unit) {
      this.logger.error(`La unidad con id ${id} no fue encontrada`);
      throw new RpcException({
        message: `La unidad con id ${id} no fue encontrada`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return unit;
  }

  async update(id: string, updateUnitDto: UpdateUnitDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    if (updateUnitDto.fuel_setpoint) {
      await this.validateFuelSetpoint(updateUnitDto.fuel_setpoint);
    }

    if (updateUnitDto.id_unit_type) {
      await this.validateUnitType(updateUnitDto.id_unit_type, slug);
    }

    if (updateUnitDto.id_fuel_type) {
      await this.validateFuelType(updateUnitDto.id_fuel_type, slug);
    }

    if (updateUnitDto.plate) {
      await this.verifyPlateExists(updateUnitDto.plate, slug);
    }

    try {
      await dbConnection.units.update({
        where: { id_unit: id, status: true },
        data: updateUnitDto,
      });

      return this.findOne(id, slug);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al actualizar la unidad ${updateUnitDto.name}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    return dbConnection.units.update({
      where: { id_unit: id },
      data: { status: false },
    });
  }

  async findUnitsByIds(units: string[], slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const units_data = [];
    const nonExistUnits = []

    for (const unit of units) {
      const unit_data = await dbConnection.units.findUnique({
        where: { id_unit: unit },
      });

      if (!units_data) {
        nonExistUnits.push(unit);
      }
      else {
        units_data.push(unit_data);
      }
    }

    if (nonExistUnits.length > 0) {
      throw new RpcException({
        message: `Las siguientes units no existen: ${nonExistUnits.join(', ')}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return units_data;
  }
}
