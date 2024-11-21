import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
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
  import { UpdateGeofenceDto } from '@travel-planning/geofences/dto/update-geofence.dto';
  import { CreateGeofenceDto } from '@travel-planning/geofences/dto/create-geofence.dto';
  import { Logger } from '@nestjs/common';
import { Auth } from '@app/common/guards/auth.decorator';

  @Controller('geofences')
  export class GeofencesController {
    private readonly logger = new Logger(GeofencesController.name);
    constructor(
      @Inject(NATS_SERVICE) private readonly clientsGeofences: ClientProxy,
    ) {}
  
    @Post()
    @Auth()
    async createGeofence(@Body() createGeofenceDto: CreateGeofenceDto, @Request() req) {
      const data = req['data'];

      try {
        const geofence = await firstValueFrom(
          this.clientsGeofences.send(
            { cmd: 'create-geofence' }, 
            { createGeofenceDto, slug: data.slug }
          ),
        );

        return geofence;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      
      }
    }
  
    @Get()
    @Auth()
    async findAllGeofences(@Query() paginationDto: PaginationDto, @Request() req) {
      const data = req['data'];
      
      try {
        const evidences = await firstValueFrom(
          this.clientsGeofences.send(
            { cmd: 'find-all-geofences' }, 
            { paginationDto, slug: data.slug }
          )
        );

        return evidences
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error); 
      }
      
    }
  
    @Get(':id')
    @Auth()
    async findOnegeofence(@Param('id') id: string, @Request() req) {
      const data = req['data'];
      
      try {
        const geofence = await firstValueFrom(
          this.clientsGeofences.send(
            { cmd: 'find-one-geofence' }, 
            { id, slug: data.slug }
          ),
        );
  
        return geofence;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      }
    }
  
    @Delete(':id')
    @Auth()
    async deleteGeofence(@Param('id') id: string, @Request() req) {
      const data = req['data'];
      
      try {
        const geofence = await firstValueFrom(
          this.clientsGeofences.send(
            { cmd: 'remove-geofence' }, 
            { id, slug: data.slug }
          ),
        );
  
        return geofence;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      }
    }
  
    @Patch(':id')
    @Auth()
    async updateGeofence(
      @Param('id') id: string,
      @Body() updateGeofenceDto: UpdateGeofenceDto,
      @Request() req
    ) {
      const data = req['data'];
        
      try {
        const geofence = await firstValueFrom(
          this.clientsGeofences.send(
            { cmd: 'update-geofence' }, 
            { "updateGeofenceDto": { id_geofence: id, ...updateGeofenceDto }, slug: data.slug }
          ),
        );
        return geofence;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      }
    }
  }
  