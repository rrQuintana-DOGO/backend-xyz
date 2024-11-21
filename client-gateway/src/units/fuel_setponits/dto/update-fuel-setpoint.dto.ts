import { PartialType } from '@nestjs/mapped-types';
import { CreateFuelSetpointDto } from './create-fuel-setpoint.dto';
import { IsUUID } from 'class-validator';

export class UpdateFuelSetpointDto extends PartialType(CreateFuelSetpointDto) {
  @IsUUID('4', { message: 'El id_fuel_setpoint debe ser de tipo UUID' })
  id_fuel_setpoint: string;
}
