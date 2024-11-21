import { PartialType } from '@nestjs/mapped-types';
import { CreateDeviceDto } from '@units/devices/dto/create-device.dto';
import { IsUUID } from 'class-validator';

export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {
  @IsUUID('4', { message: 'El id_device debe ser de tipo UUID' })
  id_device: string;
}

