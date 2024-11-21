import { PartialType } from '@nestjs/mapped-types';
import { CreateUnitDto } from '@units/dto/create-unit.dto';
import { IsUUID } from 'class-validator';

export class UpdateUnitDto extends PartialType(CreateUnitDto) {
  @IsUUID('4', { message: 'El id_unit debe ser de tipo UUID' })
  id_unit: string;
}

