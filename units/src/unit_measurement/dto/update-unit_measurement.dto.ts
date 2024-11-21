import { PartialType } from '@nestjs/mapped-types';
import { CreateUnitMeasurementDto } from './create-unit_measurement.dto';

export class UpdateUnitMeasurementDto extends PartialType(
  CreateUnitMeasurementDto,
) {
  id_unit_measurement: string;
}
