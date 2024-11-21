import { PartialType } from '@nestjs/mapped-types';
import { CreateLiscencesTypeDto } from './create-liscences_type.dto';
import { IsString } from 'class-validator';

export class UpdateLiscencesTypeDto extends PartialType(
  CreateLiscencesTypeDto,
) {
  @IsString()
  id_license: string;
}
