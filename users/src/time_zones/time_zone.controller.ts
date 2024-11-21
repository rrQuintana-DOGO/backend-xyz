import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { TimeZonesService } from '@timezones/time_zone.service';
import { CreateTimeZoneDto } from '@timezones/dto/create-time_zone.dto';
import { UpdateTimeZoneDto } from '@timezones/dto/update-time_zone.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';

@Controller('time_zones')
export class TimeZonesController {
  constructor(private readonly time_zonesService: TimeZonesService) {}

  @MessagePattern({ cmd: 'create-time-zone' })
  create(@Payload() data: { createTimeZoneDto: CreateTimeZoneDto, slug: string }) {
    const { createTimeZoneDto, slug } = data;

    return this.time_zonesService.create(createTimeZoneDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-time-zones' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.time_zonesService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-time-zone' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.time_zonesService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-time-zone' })
  @UUIDGuard('id_time_zone')
  update(@Payload() data: { updateTimeZoneDto: UpdateTimeZoneDto, slug: string }) {
    const { updateTimeZoneDto, slug } = data;

    return this.time_zonesService.update(
      updateTimeZoneDto.id_time_zone,
      updateTimeZoneDto,
      slug
    );
  }

  @MessagePattern({ cmd: 'remove-time-zone' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.time_zonesService.remove(id, slug);
  }
}
