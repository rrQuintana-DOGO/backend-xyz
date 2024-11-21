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
import { CreateSetpointDto } from './dto/create-setpoint.dto';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from '@app/common';
import { UpdateSetpointDto } from './dto/update-setpoint.dto';
import { UUIDGuard } from '@app/common/guards/uuid-guard.decorator';
import { Auth } from '@app/common/guards/auth.decorator';

@Controller('setpoints')
export class SetpointsController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly setpointsClient: ClientProxy,
  ) {}

  @Post()
  @Auth()
  async createSetponit(@Body() createSetpointDto: CreateSetpointDto, @Request() req) {
    const data = req['data'];

    try {
      const setpoint = await firstValueFrom(
        this.setpointsClient.send(
          { cmd: 'create-setpoint' },
          { createSetpointDto, slug: data.slug },
        ),
      );

      return setpoint;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  @Auth()
  async findAllSetpoints(@Query() paginationDto: PaginationDto, @Request() req) {
    const data = req['data'];

    try {
      const setpoints = await firstValueFrom(
        this.setpointsClient.send(
          { cmd: 'find-all-setpoints' }, 
          { paginationDto, slug: data.slug },
        ),
      );

      return setpoints;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  @Auth()
  @UUIDGuard('id')
  async findOneSetpoint(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const data = req['data'];

    try {
      const setpoint = await firstValueFrom(
        this.setpointsClient.send(
          { cmd: 'find-one-setpoint' }, 
          { id, slug: data.slug }
        ),
      );

      return setpoint;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @Auth()
  @UUIDGuard('id')
  async removeSetpoint(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const data = req['data'];

    try {
      const setpoint = await firstValueFrom(
        this.setpointsClient.send(
          { cmd: 'remove-setpoint' },
          { id, slug: data.slug }
        ),
      );

      return setpoint;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  @Auth()
  @UUIDGuard('id')
  async updateSetpoint(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSetpointDto: UpdateSetpointDto,
    @Request() req
  ) {
    const data = req['data'];

    try {
      const setpoint = await firstValueFrom(
        this.setpointsClient.send(
          { cmd: 'update-setpoint' },
          { "updateSetpointDto": { id_setpoint: id, ...updateSetpointDto }, slug: data.slug }
        ),
      );

      return setpoint;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
