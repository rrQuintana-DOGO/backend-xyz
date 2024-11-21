import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Logger,
    Param,
    Patch,
    Post,
    Query,
    Request,
  } from '@nestjs/common';
  import { ClientProxy, RpcException } from '@nestjs/microservices';
  import { firstValueFrom } from 'rxjs';
  import { PaginationDto } from '@common/index';
  import { NATS_SERVICE} from '@config/index';
  import { CreateEventDto } from '@notifications/event/dto/create-events.dto';
  import { UpdateEventDto } from '@notifications/event/dto/update-events.dto';
  import { Auth } from '@common/guards/auth.decorator';
  
  @Controller('events')
  export class EventsController {
    private readonly logger = new Logger(EventsController.name)
    constructor(
      @Inject(NATS_SERVICE) private readonly eventsClient: ClientProxy,
    ) {}
  
    @Post()
    @Auth()
    async createEvent(@Body() createEventDto: CreateEventDto, @Request() req) {
      const data = req['data'];

      try {
        const event = await firstValueFrom(
          this.eventsClient.send(
            { cmd: 'create-event' }, 
            {createEventDto, slug: data.slug}
          ), 
        );
  
        return event;
      } catch (error) {
        this.logger.error('Error al crear evento', error);
        throw new RpcException(error);
      }
    }
  
    @Get()
    @Auth()
    async findAllEvents(@Query() paginationDto: PaginationDto, @Request() req) {
      const data = req['data'];

      try{
        const event = await firstValueFrom(
          this.eventsClient.send({ cmd: 'find-all-events' }, { paginationDto, slug: data.slug }),
        );
  
        return event;
      } catch (error) {
        this.logger.error('Error al buscar eventos', error);
        throw new RpcException(error);
      }
    }
  
  
    @Get(':id')
    @Auth()
    async findOneEvent(@Param('id') id: string, @Request() req) {
      const data = req['data'];

      try {
        const event = await firstValueFrom(
          this.eventsClient.send({ cmd: 'find-one-event' }, { id, slug: data.slug }),
        );
  
        return event;
      } catch (error) {
        this.logger.error('Error al buscar evento', error);
        throw new RpcException(error);    }
    }
  
    @Delete(':id')
    @Auth()
    async deleteEvent(@Param('id') id: string, @Request() req) {
      const data = req['data'];

      try {
        const event = await firstValueFrom(
          this.eventsClient.send({ cmd: 'remove-event' }, { id, slug: data.slug }),
        );
  
        return event;
      } catch (error) {
        this.logger.error('Error al eliminar evento', error);
        throw new RpcException(error);    }
    }
  
    @Patch(':id')
    @Auth()
    async updateEvent(
      @Param('id') id: string,
      @Body() updateEventDto: UpdateEventDto,
      @Request() req,
    ) {
      const data = req['data'];

      try {
        const event = await firstValueFrom(
          this.eventsClient.send(
            { cmd: 'update-event' },
            { updateEventDto: { id_event: id, ...updateEventDto }, slug: data.slug }
          ),
        );
        return event;
      } catch (error) {
        this.logger.error('Error al actualizar evento', error);
        throw new RpcException(error);    }
    }
  }
  