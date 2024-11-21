import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventsRoutesService } from '@event_routes/events_routes.service';
import { CreateEventsRouteDto } from '@event_routes/dto/create-events_route.dto';
import { UpdateEventsRouteDto } from '@event_routes/dto/update-events_route.dto';
import { PaginationDto } from '@app/common';

@Controller()
export class EventsRoutesController {
  constructor(private readonly eventsRoutesService: EventsRoutesService) {}

  @MessagePattern({ cmd: 'create-events-route' })
  create(@Payload() data: {createEventsRouteDto: CreateEventsRouteDto, slug: string}) {
    const { createEventsRouteDto, slug } = data;

    return this.eventsRoutesService.create(createEventsRouteDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-events-routes' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.eventsRoutesService.findAll(slug, paginationDto);
  }

  @MessagePattern({ cmd: 'find-one-events-route' })
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.eventsRoutesService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-events-route' })
  update(@Payload() data: { updateEventsRouteDto: UpdateEventsRouteDto, slug: string }) {
    const { updateEventsRouteDto, slug } = data;

    return this.eventsRoutesService.update(
      updateEventsRouteDto.id_event_route, 
      updateEventsRouteDto, 
      slug
    );
  }

  @MessagePattern({ cmd: 'remove-events-route' })
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.eventsRoutesService.remove(id, slug);
  }
}
