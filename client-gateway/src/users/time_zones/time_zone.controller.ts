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
  import { NATS_SERVICE } from '@config/index';
  import { CreateTimeZoneDto } from '@users/time_zones/dto/create-time_zone.dto';
  import { UpdateTimeZoneDto } from '@users/time_zones/dto/update-time_zone.dto';
import { Auth } from '@app/common/guards/auth.decorator';
  
  @Controller('time_zones')
  export class TimeZonesController {
    private readonly logger = new Logger(TimeZonesController.name);
    constructor(
      @Inject(NATS_SERVICE) private readonly time_zonesClient: ClientProxy,
    ) {}
  
    @Post()
    @Auth()
    async createTimeZone(@Body() createTimeZoneDto: CreateTimeZoneDto, @Request() req) {
      const data = req['data'];

      try {
        const time_zone = await firstValueFrom(
          this.time_zonesClient.send(
            { cmd: 'create-time-zone' }, 
            { createTimeZoneDto, slug: data.slug }
          ),
        );
  
        return time_zone;
      } catch (error) {
        throw new RpcException(error);
      }
    }
  
    @Get()
    @Auth()
    async findAllTimeZones(@Query() paginationDto: PaginationDto, @Request() req) {
      const data = req['data'];
      
      try{
        const time_zones = await firstValueFrom(
          this.time_zonesClient.send(
            { cmd: 'find-all-time-zones' }, 
            { paginationDto, slug: data.slug }
          ),
        )

        return time_zones;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);
      }
    }
  
    @Get(':id')
    @Auth()
    async findOneTimeZone(@Param('id') id: string, @Request() req) {
      const data = req['data'];
      
      try {
        const time_zone = await firstValueFrom(
          this.time_zonesClient.send(
            { cmd: 'find-one-time-zone' }, 
            { id, slug: data.slug }
          ),
        );
  
        return time_zone;
      } catch (error) {
        throw new RpcException(error);    }
    }
  
    @Delete(':id')
    @Auth()
    async deleteTimeZone(@Param('id') id: string, @Request() req) {
      const data = req['data'];
      
      try {
        const time_zone = await firstValueFrom(
          this.time_zonesClient.send(
            { cmd: 'remove-time-zone' }, 
            { id, slug: data.slug }
          ),
        );
  
        return time_zone;
      } catch (error) {
        throw new RpcException(error);    }
    }
  
    @Patch(':id')
    @Auth()
    async updateTimeZone(
      @Param('id') id: string,
      @Body() updateTimeZoneDto: UpdateTimeZoneDto, 
      @Request() req
    ) {
      const data = req['data'];
        
      try {
        const time_zone = await firstValueFrom(
          this.time_zonesClient.send(
            { cmd: 'update-time-zone' }, 
            { "updateTimeZoneDto": { id_time_zone: id, ...updateTimeZoneDto }, slug: data.slug }
          ),
        );
        
        return time_zone;
      } catch (error) {
        throw new RpcException(error);    }
    }
  }
  