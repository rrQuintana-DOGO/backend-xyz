import { PartialType } from '@nestjs/mapped-types';
import { CreateEvidenceDto } from '@evidences/dto/create-evidence.dto';
import { IsUUID } from 'class-validator';

export class UpdateEvidenceDto extends PartialType(CreateEvidenceDto) {
  @IsUUID('4', { message: 'El id de la evidencia debe ser un UUID válido' })
  _id: string;
}

