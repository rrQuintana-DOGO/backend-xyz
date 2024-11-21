import { PartialType } from '@nestjs/mapped-types';
import { CreateTripTypeDto } from './create-trip_type.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTripTypeDto extends PartialType(CreateTripTypeDto) {
  @IsString()
  @IsOptional()
  id: string;
}
