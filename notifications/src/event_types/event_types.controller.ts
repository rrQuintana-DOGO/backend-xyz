import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventTypesService } from '@event_types/event_types.service';
import { CreateEventTypeDto } from '@event_types/dto/create-event_type.dto';
import { UpdateEventTypeDto } from '@event_types/dto/update-event_type.dto';
import { PaginationDto } from '@app/common';

@Controller()
export class EventTypesController {
  constructor(private readonly eventTypesService: EventTypesService) {}

  @MessagePattern('createEventType')
  create(@Payload() data: { createEventTypeDto: CreateEventTypeDto, slug: string }) {
    const { createEventTypeDto, slug } = data;

    return this.eventTypesService.create(createEventTypeDto, slug);
  }

  @MessagePattern('findAllEventTypes')
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.eventTypesService.findAll(slug, paginationDto);
  }

  @MessagePattern('findOneEventType')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.eventTypesService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-event-type' })
  update(@Payload() data: { updateEventTypeDto: UpdateEventTypeDto, slug: string }) {
    const { updateEventTypeDto, slug } = data;

    return this.eventTypesService.update(
      updateEventTypeDto.id_event_type,
      updateEventTypeDto,
      slug,
    );
  }

  @MessagePattern('removeEventType')
  remove(@Payload('id', ParseUUIDPipe) id: string, slug: string) {
    return this.eventTypesService.remove(id, slug);
  }
}
