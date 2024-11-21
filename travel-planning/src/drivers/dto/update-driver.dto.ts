import { PartialType } from '@nestjs/mapped-types';
import { CreateDriverDto } from './create-driver.dto';
import { IsUUID } from 'class-validator';

export class UpdateDriverDto extends PartialType(CreateDriverDto) {
  @IsUUID()
  id_driver: string;
}
