import { NATS_SERVICE } from '@app/config';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateUnitMeasurementDto } from '@units/unit_measurement/dto/create-unit_measurement.dto';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from '@app/common';
import { Auth } from '@app/common/guards/auth.decorator';
import { UpdateUnitMeasurementDto } from '@units/unit_measurement/dto/update-unit_measurement.dto';

@Controller('unit_measurement')
export class UnitMeasurementController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly unitMeasurementClient: ClientProxy,
  ) {}

  @Post()
  @Auth()
  async createUnitMeasurement(@Body() createUnitMeasurementDto: CreateUnitMeasurementDto, @Request() req) {
    const data = req['data'];

    try {
      const unitMeasurement = await firstValueFrom(
        this.unitMeasurementClient.send(
          { cmd: 'create-unit-measurement' },
          { createUnitMeasurementDto, slug: data.slug } ,
        ),
      );

      return unitMeasurement;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  @Auth()
  async findAllUnitMeasurement(@Query() paginationDto: PaginationDto, @Request() req) {
    const data = req['data'];

    try {
      const unitMeasurements = await firstValueFrom(
        this.unitMeasurementClient.send(
          { cmd: 'find-all-unit-measurement' },
          { paginationDto, slug: data.slug },
        ),
      );

      return unitMeasurements;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  @Auth()
  async findOneUnitMeasurement(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const data = req['data'];

    try {
      const unitMeasurement = await firstValueFrom(
        this.unitMeasurementClient.send(
          { cmd: 'find-one-unit-measurement' }, 
          { id, slug: data.slug }
        ),
      );

      return unitMeasurement;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @Auth()
  async deleteUnitMeasurement(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const data = req['data'];

    try {
      const unitMeasurement = await firstValueFrom(
        this.unitMeasurementClient.send(
          { cmd: 'remove-unit-measurement' }, 
          { id, slug: data.slug }
        ),
      );

      return unitMeasurement;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  @Auth()
  async updateUnitMeasurement(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUnitMeasurementDto: UpdateUnitMeasurementDto,
    @Request() req
  ) {
    const data = req['data'];

    try {
      const unitMeasurement = await firstValueFrom(
        this.unitMeasurementClient.send(
          { cmd: 'update-unit-measurement' }, 
          { "updateUnitMeasurementDto": { id_unit_measurement: id, ...updateUnitMeasurementDto }, slug: data.slug }
        ),
      );

      return unitMeasurement;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
