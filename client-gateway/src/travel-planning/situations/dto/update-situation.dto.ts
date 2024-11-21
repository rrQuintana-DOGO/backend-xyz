import { PartialType } from '@nestjs/mapped-types';
import { IsUUID } from 'class-validator';
import { CreateSituationDto } from '@travel-planning/situations/dto/create-situation.dto';

export class UpdateSituationDto extends PartialType(CreateSituationDto) {
  @IsUUID('4', { message: 'El id_situation debe ser un UUID válido' })
  id_situation: string;
}

