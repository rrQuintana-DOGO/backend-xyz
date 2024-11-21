import { PartialType } from '@nestjs/mapped-types';
import { CreateUnitMeasurementDto } from './create-unit_measurement.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUnitMeasurementDto extends PartialType(
  CreateUnitMeasurementDto,
) {
  @IsString()
  @IsOptional()
  id_unit_measurement: string;
}
