import { PartialType } from '@nestjs/mapped-types';
import { CreatePlaceDto } from './create-place.dto';
import { IsUUID } from 'class-validator';

export class UpdatePlaceDto extends PartialType(CreatePlaceDto) {
  @IsUUID('4', { message: 'El id_place debe ser de tipo UUID' })
  id_place: string;
}


