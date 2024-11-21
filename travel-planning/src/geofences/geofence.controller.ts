import { Controller, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GeofenceService } from '@geofences/geofence.service';
import { CreateGeofenceDto } from '@geofences/dto/create-geofence.dto';
import { UpdateGeofenceDto } from '@geofences/dto/update-geofence.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';

@Controller('geofences')
export class  GeofencesController {
  constructor(private readonly geofencesService: GeofenceService) {}

  @MessagePattern({ cmd: 'create-geofence' })
  create(@Payload() data: { createGeofenceDto: CreateGeofenceDto, slug: string }) {
    const { createGeofenceDto, slug } = data;

    return this.geofencesService.create(createGeofenceDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-geofences' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.geofencesService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-geofence' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.geofencesService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-geofence' })
  update(@Payload() data: { updateGeofenceDto: UpdateGeofenceDto, slug: string }) {
    const { updateGeofenceDto, slug } = data;

    return this.geofencesService.update(updateGeofenceDto.id_geofence, updateGeofenceDto, slug);
  }

  @MessagePattern({ cmd: 'remove-geofence' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.geofencesService.remove(id, slug);
  }
}
