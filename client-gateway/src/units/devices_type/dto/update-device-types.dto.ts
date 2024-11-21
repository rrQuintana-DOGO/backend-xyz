import { PartialType } from '@nestjs/mapped-types';
import { CreateDeviceTypeDto } from '@units/devices_type/dto/create-device-types.dto';
import { IsUUID } from 'class-validator';

export class UpdateDeviceTypeDto extends PartialType(CreateDeviceTypeDto) {
  @IsUUID('4', { message: 'El id_device_type debe ser de tipo UUID' })
  id_device_type: string;
}



