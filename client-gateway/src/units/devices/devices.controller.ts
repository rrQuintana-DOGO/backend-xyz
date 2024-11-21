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
  import { UpdateDeviceDto } from '@units/devices/dto/update-device.dto';
  import { CreateDeviceDto } from '@units/devices/dto/create-device.dto';
  import { Logger } from '@nestjs/common';
  import { Auth } from '@app/common/guards/auth.decorator';

  @Controller('devices')
  export class DevicesController {
    private readonly logger = new Logger(DevicesController.name);
    constructor(
      @Inject(NATS_SERVICE) private readonly clientsDevice: ClientProxy,
    ) {}
  
    @Post()
    @Auth()
    async createDevice(@Body() createDeviceDto: CreateDeviceDto, @Request() req) {
      const data = req['data'];

      try {
        const device = await firstValueFrom(
          this.clientsDevice.send(
            { cmd: 'create-device' }, 
            { createDeviceDto, slug: data.slug }
          ),
        );
  
        return device;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      }
    }
  
    @Get()
    @Auth()
    async findAllDevices(@Query() paginationDto: PaginationDto, @Request() req) {
      const data = req['data'];

      try {
        const devices = await firstValueFrom(
          this.clientsDevice.send(
            { cmd: 'find-all-devices' }, 
            { paginationDto, slug: data.slug }
          )
        );
        return devices;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      }
    }
  
    @Get(':id')
    @Auth()
    async findOneDevice(@Param('id') id: string, @Request() req) {
      const data = req['data'];

      try {
        const device = await firstValueFrom(
          this.clientsDevice.send(
            { cmd: 'find-one-device' }, 
            { id, slug: data.slug }
          ),
        );
  
        return device;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      }
    }
  
    @Delete(':id')
    @Auth()
    async deleteDevice(@Param('id') id: string, @Request() req) {
      const data = req['data'];

      try {
        const device = await firstValueFrom(
          this.clientsDevice.send(
            { cmd: 'remove-device' }, 
            { id, slug: data.slug }
          ),
        );
  
        return device;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      }
    }
  
    @Patch(':id')
    @Auth()
    async updateDevice(
      @Param('id') id: string,
      @Body() updateDeviceDto: UpdateDeviceDto,
      @Request() req
    ) {
      const data = req['data'];
      
      try {
        const device = await firstValueFrom(
          this.clientsDevice.send(
            { cmd: 'update-device' }, 
            { "updateDeviceDto": { id_device : id, ...updateDeviceDto }, slug: data.slug },
          ),
        );
  
        return device;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      }
    }
  }
  