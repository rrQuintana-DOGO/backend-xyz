import { PartialType } from '@nestjs/mapped-types';
import { CreateTimeZoneDto } from '@users/time_zones/dto/create-time_zone.dto';
import { IsString } from 'class-validator';

export class UpdateTimeZoneDto extends PartialType(CreateTimeZoneDto) {
  @IsString()
  id_time_zone: string;
}
