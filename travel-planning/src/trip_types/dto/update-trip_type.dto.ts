import { PartialType } from '@nestjs/mapped-types';
import { CreateTripTypeDto } from './create-trip_type.dto';
import { IsString } from 'class-validator';

export class UpdateTripTypeDto extends PartialType(CreateTripTypeDto) {
  @IsString()
  id_trip_type: string;
}
