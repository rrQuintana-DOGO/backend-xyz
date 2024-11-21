import { Controller, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { DeviceTypeService } from '@devices_type/device-types.service';
import { CreateDeviceTypeDto } from '@devices_type//dto/create-device-type.dto';
import { UpdateDeviceTypeDto } from '@devices_type/dto/update-device-type.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';

@Controller('device_types')
export class  DeviceTypesController {
  constructor(private readonly devicesService: DeviceTypeService) {}

  @MessagePattern({ cmd: 'create-device-types' })
  create(@Payload() data: {createDeviceTypeDto: CreateDeviceTypeDto, slug: string}) {
    const { createDeviceTypeDto, slug } = data;

    return this.devicesService.create(createDeviceTypeDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-device-types' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.devicesService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-device-types' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.devicesService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-device-types' })
  update(@Payload() data: { updateDeviceTypeDto: UpdateDeviceTypeDto, slug: string }) {
    const { updateDeviceTypeDto, slug } = data;

    return this.devicesService.update(updateDeviceTypeDto.id_device_type, updateDeviceTypeDto, slug);
  }

  @MessagePattern({ cmd: 'remove-device-types' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.devicesService.remove(id, slug);
  }
}
