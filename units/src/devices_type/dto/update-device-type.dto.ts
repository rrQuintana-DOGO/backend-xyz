import { PartialType } from '@nestjs/mapped-types';
import { CreateDeviceTypeDto } from '@devices_type/dto/create-device-type.dto';
import { IsString, IsUUID } from 'class-validator';

export class UpdateDeviceTypeDto extends PartialType(CreateDeviceTypeDto) {
  @IsUUID('4', { message: 'El id_device_type debe ser de tipo UUID' })
  id_device_type: string;
}

