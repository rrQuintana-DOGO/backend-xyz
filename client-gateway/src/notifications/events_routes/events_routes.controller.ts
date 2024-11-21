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
import { PaginationDto } from 'src/common';
import { CreateEventsRouteDto } from '@notifications/events_routes/dto/create-events_route.dto';
import { UpdateEventsRouteDto } from '@notifications/events_routes/dto/update-events_route.dto';
import { firstValueFrom } from 'rxjs';
import { Auth } from '@common/guards/auth.decorator';

@Controller('events_routes')
export class EventsRoutesController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly eventsRoutesClient: ClientProxy,
  ) {}

  @Post()
  @Auth()
  async createEventsRoute(@Body() createEventsRouteDto: CreateEventsRouteDto, @Request() req) {
    const data = req['data'];

    try {
      const eventsRoute = await firstValueFrom(
        this.eventsRoutesClient.send(
          { cmd: 'create-events-route' }, 
          { createEventsRouteDto, slug: data.slug }),
      );

      return eventsRoute;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  @Auth()
  async findAllEventsRoutes(@Query() paginationDto: PaginationDto, @Request() req) {
    const data = req['data'];

    try {
      const eventsRoutes = await firstValueFrom(
        this.eventsRoutesClient.send(
          { cmd: 'find-all-events-routes' },
          { paginationDto, slug: data.slug },
        ),
      );

      return eventsRoutes;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  @Auth()
  async findOneEventsRoute(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const data = req['data'];

    try {
      const eventsRoute = await firstValueFrom(
        this.eventsRoutesClient.send(
          { cmd: 'find-one-events-route' },
          { id, slug: data.slug },
        ),
      );

      return eventsRoute;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  @Auth()
  async updateEventsRoute(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEventsRouteDto: UpdateEventsRouteDto,
    @Request() req,
  ) {
    const data = req['data'];

    try {
      const eventsRoute = await firstValueFrom(
        this.eventsRoutesClient.send(
          { cmd: 'update-events-route' },
          { updateEventsRouteDto: { id_event_route:id, ...updateEventsRouteDto }, slug: data.slug },
        ),
      );

      return eventsRoute;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @Auth()
  async deleteEventsRoute(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const data = req['data'];

    try {
      const eventsRoute = await firstValueFrom(
        this.eventsRoutesClient.send(
          { cmd: 'remove-events-route' }, 
          { id, slug: data.slug }
        ));

      return eventsRoute;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
