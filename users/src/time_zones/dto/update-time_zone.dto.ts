import { PartialType } from '@nestjs/mapped-types';
import { CreateTimeZoneDto } from '@timezones/dto/create-time_zone.dto';
import { IsString, IsPositive } from 'class-validator';

export class UpdateTimeZoneDto extends PartialType(CreateTimeZoneDto) {
  @IsString()
  id_time_zone: string;
}
