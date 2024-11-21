import { PartialType } from '@nestjs/mapped-types';
import { CreateFuelTypeDto } from '@fuel_types/dto/create-fuel-type.dto';
import {IsUUID } from 'class-validator';

export class UpdateFuelTypeDto extends PartialType(CreateFuelTypeDto) {
  @IsUUID('4', { message: 'El id_fuel_type debe ser de tipo UUID' })
  id_fuel_type: string;
}

