import { PartialType } from '@nestjs/mapped-types';
import { CreateSetpointDto } from './create-setpoint.dto';

export class UpdateSetpointDto extends PartialType(CreateSetpointDto) {
  id_setpoint: string;
}
