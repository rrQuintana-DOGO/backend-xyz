import { PartialType } from '@nestjs/mapped-types';
import { CreateUnitTypeDto } from '@units_type/dto/create-unit-type.dto';
import { IsString, IsUUID } from 'class-validator';

export class UpdateUnitTypeDto extends PartialType(CreateUnitTypeDto) {
  @IsUUID('4', { message: 'El id_unit_type debe ser de tipo UUID' })
  id_unit_type: string;
}

