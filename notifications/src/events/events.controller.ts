import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { EventsService } from '@events/events.service';
import { CreateEventDto } from '@events/dto/create-events.dto';
import { UpdateEventDto } from '@events/dto/update-events.dto';
import { IdsDto } from '@events/dto/ids.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @MessagePattern({ cmd: 'create-event' })
  create(@Payload() data: { createEventDto: CreateEventDto, slug: string }) {
    const { createEventDto, slug } = data;

    return this.eventsService.create(createEventDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-events' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.eventsService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'validate-events' })
  validateEvents(@Payload() idsDto: IdsDto) {
    return this.eventsService.validateEventsExist(idsDto.events, idsDto.property, idsDto.slug);
  }

  @MessagePattern({ cmd: 'find-one-event'})
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.eventsService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-event' })
  update(@Payload() data: { updateEventDto: UpdateEventDto; slug: string }) {
    const { updateEventDto, slug } = data;
  
    return this.eventsService.update(updateEventDto.id_event, updateEventDto, slug);
  }

  @MessagePattern({ cmd: 'remove-event' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.eventsService.remove(id, slug);
  }

  @MessagePattern({ cmd: 'find-events-by-ids' })
  @UUIDGuard('events')
  findEventsByIds(@Payload('events') events: Array<string>, slug: string) {
    return this.eventsService.findEventsByIds(events, slug);
  }
}
