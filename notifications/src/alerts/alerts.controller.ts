import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { AlertsService } from '@alerts/alerts.service';
import { CreateAlertDto } from '@alerts/dto/create-alerts.dto';
import { UpdateAlertDto } from '@alerts/dto/update-alerts.dto';
import { CreateNotificationsTelemetryDto } from '@alerts/dto/create_notifications-telemetry';
import { CreateNotificationsGeofencesDto } from '@alerts/dto/create-alert-geofence';
import { CloseAlertDto } from '@alerts/dto/close-alerts.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @MessagePattern({ cmd: 'create-alert' })
  create(@Payload() data: { createAlertDto: CreateAlertDto, slug: string }) {
    const { createAlertDto, slug } = data;
    
    return this.alertsService.create(createAlertDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-alerts' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.alertsService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-trips-with-alerts' })
  findAllTripsWithAlerts() {
    return this.alertsService.findAllTripsWithAlerts();
  }

  @MessagePattern({ cmd: 'find-all-alerts-by-trips' })
  findAllByTrips(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.alertsService.findAllByTrips(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-alert' })
  @UUIDGuard('id')
  async findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return await this.alertsService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-alert' })
  @UUIDGuard('id')
  update(@Payload() data: { updateAlertDto: UpdateAlertDto, slug: string }) {
    const { updateAlertDto, slug } = data;
    
    return this.alertsService.update(updateAlertDto._id, updateAlertDto, slug);
  }

  @MessagePattern({ cmd: 'close-alert' })
  close_alert(@Payload() data: { closeAlertDto: CloseAlertDto, slug: string }) {
    const { closeAlertDto, slug } = data;

    return this.alertsService.close_alert(closeAlertDto, slug);
  }

  @MessagePattern({ cmd: 'create-notification-telemetry' })
  createNotificationTelemetry(@Payload() data: { createNotificationsTelemetryDto: CreateNotificationsTelemetryDto, slug: string }) {

    const { createNotificationsTelemetryDto, slug } = data;    
    return this.alertsService.createNotificationTelemetry(createNotificationsTelemetryDto, slug);
  }

  @MessagePattern({ cmd: 'create-notification-geofences' })
  createNotificationGeofences(@Payload() data: { createNotificationsGeofencesDto: CreateNotificationsGeofencesDto, slug: string }) {

    const { createNotificationsGeofencesDto, slug } = data;    
    return this.alertsService.createGeofenceTelemetry(createNotificationsGeofencesDto, slug);
  }
}
