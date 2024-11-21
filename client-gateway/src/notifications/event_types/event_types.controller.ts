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
import { CreateEventTypeDto } from './dto/create-event_type.dto';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from '@app/common';
import { UpdateEventTypeDto } from '@notifications/event_types/dto/update-event_type.dto';
import { Auth } from '@common/guards/auth.decorator';

@Controller('event_types')
export class EventTypesController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly eventTypesClient: ClientProxy,
  ) {}

  @Post()
  @Auth()
  async createEventType(@Body() createEventTypeDto: CreateEventTypeDto, @Request() req) {
    const data = req['data'];

    try {
      const eventType = await firstValueFrom(
        this.eventTypesClient.send('createEventType', { createEventTypeDto, slug: data.slug }),
      );

      return eventType;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  @Auth()
  async findAllEventTypes(@Query() paginationDto: PaginationDto, @Request() req) {
    const data = req['data'];

    try {
      const eventTypes = await firstValueFrom(
        this.eventTypesClient.send('findAllEventTypes', { paginationDto, slug: data.slug }),
      );
      return eventTypes;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  @Auth()
  async findOneEventType(@Param('id', new ParseUUIDPipe()) id: string, @Request() req) {
    const data = req['data'];

    try {
      const eventType = await firstValueFrom(
        this.eventTypesClient.send('findOneEventType', { id, slug: data.slug }),
      );

      return eventType;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  @Auth()
  async updateEventType(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateEventTypeDto: UpdateEventTypeDto,
    @Request() req,
  ) {
    const data = req['data'];

    try {
      const eventType = await firstValueFrom(
        this.eventTypesClient.send(
          { cmd: 'update-event-type' },
          { "updateEventTypeDto": { id_event_type: id, ...updateEventTypeDto }, slug: data.slug }
        ),
      );

      return eventType;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @Auth()
  async deleteEventType(@Param('id', new ParseUUIDPipe()) id: string, @Request() req) {
    const data = req['data'];

    try {
      const eventType = await firstValueFrom(
        this.eventTypesClient.send('deleteEventType', { id, slug: data.slug }),
      );

      return eventType;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
