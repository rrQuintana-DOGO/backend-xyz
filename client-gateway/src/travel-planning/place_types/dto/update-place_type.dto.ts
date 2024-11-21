import { PartialType } from '@nestjs/mapped-types';
import { CreatePlaceTypeDto } from './create-place_type.dto';
import { IsUUID } from 'class-validator';

export class UpdatePlaceTypeDto extends PartialType(CreatePlaceTypeDto) {
  @IsUUID('4', { message: 'El id_place_type debe ser de tipo UUID' })
  id_place_type: string;
}

