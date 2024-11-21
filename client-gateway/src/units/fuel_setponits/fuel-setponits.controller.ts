import { NATS_SERVICE } from '@app/config';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateFuelSetpointDto } from './dto/create-fuel-setpoint.dto';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from '@app/common';
import { UpdateFuelSetpointDto } from './dto/update-fuel-setpoint.dto';
import { UUIDGuard } from '@app/common/guards/uuid-guard.decorator';

@Controller('fuelsetpoints')
export class FuelSetpointsController {
  private readonly logger = new Logger(FuelSetpointsController.name);
  constructor(
    @Inject(NATS_SERVICE)
    private readonly FuelsetpointsClient: ClientProxy,
  ) {}

  @Post()
  async createFuelSetponit(@Body() createFuelSetpointDto: CreateFuelSetpointDto) {
    try {
      const Fuelsetpoint = await firstValueFrom(
        this.FuelsetpointsClient.send('create-fuel-setpoint', createFuelSetpointDto),
      );

      return Fuelsetpoint;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  async findAllFuelSetpoints(@Query() paginationDto: PaginationDto) {
    try {
      const Fuelsetpoints = await firstValueFrom(
        this.FuelsetpointsClient.send('find-all-fuel-setpoints', paginationDto),
      );

      return Fuelsetpoints;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  @UUIDGuard('id')
  async findOneFuelSetpoint(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const FuelSetpoint = await firstValueFrom(
        this.FuelsetpointsClient.send('find-one-fuel-setpoint', { id }),
      );

      return FuelSetpoint;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @UUIDGuard('id')
  async removeFuelSetpoint(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const Fuelsetpoint = await firstValueFrom(
        this.FuelsetpointsClient.send('remove-setpoint', { id }),
      );

      return Fuelsetpoint;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async updatePlaceTypes(
    @Param('id') id: string,
    @Body() updateFuelSetpoinDto: UpdateFuelSetpointDto,
  ) {
    try {
      const fuel_setpoint = await firstValueFrom(
        this.FuelsetpointsClient.send('update-fuelsetpoint', { id_fuel_setpoint : id, ...updateFuelSetpoinDto }),
      );
      return fuel_setpoint;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);      }
  }
}

