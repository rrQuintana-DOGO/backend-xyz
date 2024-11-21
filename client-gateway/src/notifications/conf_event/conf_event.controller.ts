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
    Request
  } from '@nestjs/common';
  import { ClientProxy, RpcException } from '@nestjs/microservices';
  import { firstValueFrom } from 'rxjs';
  import { PaginationDto } from '@common/index';
  import { NATS_SERVICE } from '@config/index';
  import { CreateEventConfDto } from '@notifications/conf_event/dto/create-conf_events.dto';
  import { UpdateEventConfDto } from '@notifications/conf_event/dto/update-conf_events.dto';
  import { Auth } from '@common/guards/auth.decorator';
  
  @Controller('eventsconf')
  export class EventsConfController {
    private readonly logger = new Logger(EventsConfController.name);
    constructor(
      @Inject(NATS_SERVICE) private readonly eventsConfigClient: ClientProxy,
    ) {}
  
    @Post()
    @Auth()
    async createEventConf(@Body() createEventConfDto: CreateEventConfDto, @Request() req) {
      const data = req['data'];

      try {
        const event = await firstValueFrom(
          this.eventsConfigClient.send({ cmd: 'create-event-config' }, { createEventConfDto, slug: data.slug }),
        );
  
        return event;
      } catch (error) {
        this.logger.error('Error al crear evento', error);
        throw new RpcException(error);
      }
    }
  
    @Get()
    @Auth()
    async findAllEventConfs(@Query() paginationDto: PaginationDto, @Request() req) {
      const data = req['data'];

      try {
        const event = await firstValueFrom(
          this.eventsConfigClient.send({ cmd: 'find-all-events-config' }, { paginationDto, slug: data.slug }),
        );
  
        return event;
      } catch (error) {
        this.logger.error('Error al buscar eventos', error);
        throw new RpcException(error);
      }
    }
  
    @Get(':id')
    @Auth()
    async findOneEventConf(@Param('id') id: string, @Request() req) {
      const data = req['data'];

      try {
        const event = await firstValueFrom(
          this.eventsConfigClient.send({ cmd: 'find-one-event-config' }, { id, slug: data.slug }),
        );
  
        return event;
      } catch (error) {
        this.logger.error('Error al buscar evento', error);
        throw new RpcException(error);    }
    }
  
    @Delete(':id')
    @Auth()
    async deleteEventConf(@Param('id') id: string, @Request() req) {
      const data = req['data'];

      try {
        const event = await firstValueFrom(
          this.eventsConfigClient.send({ cmd: 'remove-event-config' }, { id, slug: data.slug }),
        );
  
        return event;
      } catch (error) {
        this.logger.error('Error al buscar evento', error);
        throw new RpcException(error);    }
    }
  
    @Patch(':id')
    @Auth()
    async updateEventConf(
      @Param('id') id: string,
      @Body() updateEventConfDto: UpdateEventConfDto,
      @Request() req
    ) {
      const data = req['data'];

      try {
        const event = await firstValueFrom(
          this.eventsConfigClient.send({ cmd: 'update-event-config' }, { id_conf_event : id, slug:data.slug, ...updateEventConfDto }),
        );
        return event;
      } catch (error) {
        this.logger.error('Error al actualizar evento', error);
        throw new RpcException(error);    }
    }
  }
  