import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { CreateLiscencesTypeDto } from './create-liscences_types.dto';

export class UpdateLiscencesTypeDto extends PartialType(
  CreateLiscencesTypeDto,
) {
  @IsNumber()
  @IsOptional()
  @IsPositive()
  id_clients: number;
}
