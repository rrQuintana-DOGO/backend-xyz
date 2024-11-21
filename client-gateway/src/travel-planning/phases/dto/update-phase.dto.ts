import { PartialType } from '@nestjs/mapped-types';
import { CreatePhaseDto } from '@travel-planning/phases/dto/create-phase.dto';
import { IsUUID } from 'class-validator';

export class UpdatePhaseDto extends PartialType(CreatePhaseDto) {
  @IsUUID('4', { message: 'El id de la fase debe ser un UUID válido' })
  id_phase: string;
}

