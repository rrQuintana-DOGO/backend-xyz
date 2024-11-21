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
  import { UpdateDeviceTypeDto } from '@units/devices_type/dto/update-device-types.dto';
  import { CreateDeviceTypeDto } from '@units/devices_type/dto/create-device-types.dto';
  import { Logger } from '@nestjs/common';
  import { Auth } from '@app/common/guards/auth.decorator';

  @Controller('device-types')
  export class DeviceTypesTypesController {
    private readonly logger = new Logger(DeviceTypesTypesController.name);
    constructor(
      @Inject(NATS_SERVICE) private readonly clientsDeviceTypes: ClientProxy,
    ) {}
  
    @Post()
    @Auth()
    async createDeviceTypes(@Body() createDeviceTypeDto: CreateDeviceTypeDto, @Request() req) {
      const data = req['data'];
      
      try {
        const device_types = await firstValueFrom(
          this.clientsDeviceTypes.send(
            { cmd: 'create-device-types' },
            { createDeviceTypeDto, slug: data.slug }
          ),
        );
        return device_types;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      
      }
    }
  
    @Get()
    @Auth()
    async findAllDeviceTypesTypes(@Query() paginationDto: PaginationDto, @Request() req) {
      const data = req['data'];

      try {
        const device_types = await firstValueFrom(
          this.clientsDeviceTypes.send(
            { cmd: 'find-all-device-types' }, 
            { paginationDto, slug: data.slug }
          ),
        );
        return device_types;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      
      }
    }
  
    @Get(':id')
    @Auth()
    async findOneDeviceTypes(@Param('id') id: string, @Request() req) {
      const data = req['data'];

      try {
        const device_types = await firstValueFrom(
          this.clientsDeviceTypes.send(
            { cmd: 'find-one-device-types' }, 
            { id, slug: data.slug }
          ),
        );
  
        return device_types;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      
      }
    }
  
    @Delete(':id')
    @Auth()
    async deleteDeviceTypes(@Param('id') id: string, @Request() req) {
      const data = req['data'];

      try {
        const device_types = await firstValueFrom(
          this.clientsDeviceTypes.send(
            { cmd: 'remove-device-types' }, 
            { id, slug: data.slug }
          ),
        );
  
        return device_types;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      
      }
    }
  
    @Patch(':id')
    @Auth()
    async updateDeviceTypes(
      @Param('id') id: string,
      @Body() updateDeviceTypeDto: UpdateDeviceTypeDto,
      @Request() req,
    ) {
      const data = req['data'];

      return data;

      try {
        const device_types = await firstValueFrom(
          this.clientsDeviceTypes.send(
            { cmd: 'update-device-types' }, 
            { "updateDeviceTypeDto": { id_device_type : id, ...updateDeviceTypeDto }, slug: data.slug }
          ),
        );
        return device_types;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      
      }
    }
  }
  