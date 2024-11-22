import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  ParseUUIDPipe,
  Request
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from '@common/index';
import { NATS_SERVICE } from '@config/index';
import { CreateAlertDto } from '@notifications/alerts/dto/create-alerts.dto';
import { UpdateAlertDto } from '@notifications/alerts/dto/update-alerts.dto';
import { CloseAlertDto } from './dto/close-alerts.dto';
import { CreateNotificationsTelemetryDto } from './dto/create_notifications-telemetry';
import { CreateNotificationsGeofencesDto } from './dto/create-alert-geofence';
import { Auth } from '@common/guards/auth.decorator';

@Controller('alerts')
export class AlertsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly alertClient: ClientProxy,
  ) {}

  @Post()
  @Auth()
  async createAlert(@Body() createAlertDto: CreateAlertDto, @Request() req) {
    const data = req['data'];

    try {
      const alert = await firstValueFrom(
        this.alertClient.send(
          { cmd: 'create-alert' }, 
          { createAlertDto, slug: data.slug }
        ),
      );

      return alert;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  @Auth()
  async findAllAlerts(@Query() paginationDto: PaginationDto, @Request() req) {
    const data = req['data'];

    try {
      return this.alertClient.send({ cmd: 'find-all-alerts' }, { paginationDto, slug: data.slug });
    }
    catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('/trips')
  @Auth()
  async findAllByTrips(@Query() paginationDto: PaginationDto, @Request() req) {
    const data = req['data'];

    try {
      return this.alertClient.send({ cmd: 'find-all-alerts-by-trips' }, { paginationDto, slug: data.slug });
    }
    catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  @Auth()
  async findOneAlert(@Param('id') id: string, @Request() req) {
    const data = req['data'];

    try {
      const alert = await firstValueFrom(
        this.alertClient.send({ cmd: 'find-one-alert' }, { id, slug: data.slug }),
      );
  
      return alert;
  
    }
    catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('/close_alert')
  @Auth()
  async close_alert(@Body() closeAlertDto: CloseAlertDto, @Request() req) {
    const data = req['data'];

    try {
      const alert = await firstValueFrom(
        this.alertClient.send({ cmd: 'close-alert' }, { closeAlertDto, slug: data.slug }),
      );

      return alert; 
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('/notification_telemetry')
  @Auth()
  async notification_telemetry(@Body() createNotificationsTelemetryDto: CreateNotificationsTelemetryDto, @Request() req) {
    const data = req['data'];

    try {
      //return data;
      const notifi_telemetry = await firstValueFrom(
        this.alertClient.send({ cmd: 'create-notification-telemetry' }, { createNotificationsTelemetryDto, slug: data.slug }),
      );

      return notifi_telemetry; 
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('/notification_geofences')
  @Auth()
  async notification_geofences(@Body() createNotificationsGeofencesDto: CreateNotificationsGeofencesDto, @Request() req) {
    const data = req['data'];

    try {
      //return data;
      const notifi_telemetry = await firstValueFrom(
        this.alertClient.send({ cmd: 'create-notification-geofences' }, { createNotificationsGeofencesDto, slug: data.slug }),
      );

      return notifi_telemetry; 
    } catch (error) {
      throw new RpcException(error);
    }
  }
 
  @Patch(':id')
  @Auth()
  async updateAlert(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlertDto: UpdateAlertDto,
    @Request() req,
  ) {
    const data = req['data'];
    
    try {
      updateAlertDto._id = id;
      const alert = await firstValueFrom(
        this.alertClient.send({ cmd: 'update-alert' }, { _id: id, slug:data.slug, ...updateAlertDto }),
      );
      return alert;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
