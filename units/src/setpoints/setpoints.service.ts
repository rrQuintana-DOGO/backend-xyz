import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateSetpointDto } from '@setpoints/dto/create-setpoint.dto';
import { UpdateSetpointDto } from '@setpoints/dto/update-setpoint.dto';
import { PaginationDto } from '@app/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Setpoint } from '@setpoints/entities/setpoint.entity';
import { DataBaseManagerService } from '@dbManager/db_manager.service';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from '@app/config';

@Injectable()
export class SetpointsService {
  private readonly logger = new Logger(SetpointsService.name);

  constructor(
    @Inject(NATS_SERVICE)
    private readonly clientUnitMeasurement: ClientProxy,
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async create(createSetpointDto: CreateSetpointDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { id_unit_measurement, ...data } = createSetpointDto;

    try{
      const id_unit_measurement = await firstValueFrom(
        this.clientUnitMeasurement.send({ cmd: 'find-one-unit-measurement' }, { id: createSetpointDto.id_unit_measurement, slug: slug })
      );   
    } catch {
      this.logger.error(`El id_unit_measurement ${createSetpointDto.id_unit_measurement} no fue encontrado`);

      throw new RpcException({
        message: `El id_unit_measurement ${createSetpointDto.id_unit_measurement} no fue encontrado`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const setpointData = {
      ...data,
      unit_measurements: {
        connect: {
          id_unit_measurement: id_unit_measurement,
        },
      },
    };

    return dbConnection.setpoints.create({
      data: setpointData,
    });
  }

  async validateSetpointsExist(setpoints: string[], field: string = 'id_setpoint', slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const nonExistentSetpoints: string[] = [];
    const existentSetpoints: Partial<Setpoint>[] = [];

    for (const setpoint of setpoints) {
      const setpointExist = await dbConnection.setpoints.findFirst({
        where: { [field]: setpoint, status: true },
        select: { id_setpoint: true, name: true },
      });

      if (!setpointExist) {
        nonExistentSetpoints.push(setpoint);
      } else {
        existentSetpoints.push(setpointExist);
      }
    }

    if (nonExistentSetpoints.length > 0) {
      throw new RpcException({
        message: nonExistentSetpoints.toString(),
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return existentSetpoints;
  }



  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit } = paginationDto;

    const totalPages = await dbConnection.setpoints.count({
      where: { status: true },
    });

    if (page > totalPages) {
      throw new RpcException({
        message: `La página ${page} no fue encontrada`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const lastPage = Math.ceil(totalPages / limit);

    const setpoints = await dbConnection.setpoints.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { status: true },
    });

    return {
      data: setpoints,
      meta: {
        total_records: totalPages,
        current_page: page,
        total_pages: lastPage,
      },
    };
  }

  async findOne(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const setpoint = await dbConnection.setpoints.findUnique({
      where: { id_setpoint: id },
    });

    if (!setpoint) {
      throw new RpcException({
        message: `El setponint con id ${id} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return setpoint;
  }

  async update(id: string, updateSetpointDto: UpdateSetpointDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);


    await this.findOne(id, slug);

    return dbConnection.setpoints.update({
      where: { id_setpoint: id },
      data: updateSetpointDto,
    });
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const setpoint = await dbConnection.setpoints.findUnique({
      where: { id_setpoint: id },
    });

    if (!setpoint) {
      throw new RpcException({
        message: `El setponint con id ${id} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return dbConnection.setpoints.update({
      where: { id_setpoint: id },
      data: { status: false },
    });
  }
}
