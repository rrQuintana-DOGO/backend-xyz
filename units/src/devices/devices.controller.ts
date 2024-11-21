import { Controller, ParseUUIDPipe, UseGuards} from '@nestjs/common';
import { DeviceService } from '@devices/devices.service';
import { CreateDeviceDto } from '@devices/dto/create-device.dto';
import { UpdateDeviceDto } from '@devices/dto/update-device.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';
@Controller('devices')
export class  DevicesController {
  constructor(private readonly devicesService: DeviceService) {}

  @MessagePattern({ cmd: 'create-device' })
  @UUIDGuard('groups')
  create(@Payload() data: {createDeviceDto: CreateDeviceDto, slug: string}) {
    const { createDeviceDto, slug } = data;

    return this.devicesService.create(createDeviceDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-devices' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.devicesService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-device' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.devicesService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-device' })
  @UUIDGuard('groups')
  update(@Payload() data: { updateDeviceDto: UpdateDeviceDto, slug: string }) {
    const { updateDeviceDto, slug } = data;

    return this.devicesService.update(updateDeviceDto.id_device, updateDeviceDto, slug);
  }

  @MessagePattern({ cmd: 'remove-device' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string , @Payload('slug') slug: string) {
    return this.devicesService.remove(id, slug);
  }
}
