import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { AlertsService } from '@alerts/alerts.service';
import { CreateAlertDto } from '@alerts/dto/create-alerts.dto';
import { UpdateAlertDto } from '@alerts/dto/update-alerts.dto';
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
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.alertsService.findAll(paginationDto);
  }

  @MessagePattern({ cmd: 'find-all-trips-with-alerts' })
  findAllTripsWithAlerts() {
    return this.alertsService.findAllTripsWithAlerts();
  }

  @MessagePattern({ cmd: 'find-all-alerts-by-trips' })
  findAllByTrips(@Payload() paginationDto: PaginationDto) {
    return this.alertsService.findAllByTrips(paginationDto);
  }

  @MessagePattern({ cmd: 'find-one-alert' })
  @UUIDGuard('id')
  async findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return await this.alertsService.findOne(id);
  }

  @MessagePattern({ cmd: 'update-alert' })
  @UUIDGuard('id')
  update(@Payload() updateAlertDto: UpdateAlertDto) {
    return this.alertsService.update(updateAlertDto._id, updateAlertDto);
  }

  @MessagePattern({ cmd: 'close-alert' })
  close_alert(@Payload() closeAlertDto: CloseAlertDto) {
    return this.alertsService.close_alert(closeAlertDto);
  }
}
