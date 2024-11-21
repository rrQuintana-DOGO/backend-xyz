import { PartialType } from '@nestjs/mapped-types';
import { CreateStatusDto } from '@travel-planning/status/dto/create-status.dto';
import { IsUUID } from 'class-validator';

export class UpdateStatusDto extends PartialType(CreateStatusDto) {
  @IsUUID('4', { message: 'El id del estatus debe ser un UUID válido' })
  id_status: string;
}

