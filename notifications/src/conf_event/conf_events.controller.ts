import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { EventsConfService } from '@eventsconfig/conf_events.service';
import { CreateEventConfDto } from '@eventsconfig/dto/create-conf_events.dto';
import { UpdateEventConfDto } from '@eventsconfig/dto/update-conf_events.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';
import { da } from '@faker-js/faker';
@Controller('eventsconf')
export class EventsConfController {
  constructor(private readonly eventsConfService: EventsConfService) {}

  @MessagePattern({ cmd: 'create-event-config' })
  create(@Payload() data: { createEventConfDto: CreateEventConfDto, slug: string }) {
    const { createEventConfDto, slug } = data;

    return this.eventsConfService.create(createEventConfDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-events-config' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.eventsConfService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-event-config' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, slug: string) {
    return this.eventsConfService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-event-config' })
  update(@Payload() data: { updateEventDto: UpdateEventConfDto, slug: string }) {
    const { updateEventDto, slug } = data;

    return this.eventsConfService.update(updateEventDto.id_conf_event, updateEventDto, slug);
  }

  @MessagePattern({ cmd: 'remove-event-config' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, slug: string) {
    return this.eventsConfService.remove(id, slug);
  }
}
