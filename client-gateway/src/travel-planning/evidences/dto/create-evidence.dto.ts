import { IsString, IsOptional, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { IsNotEmptyObject } from '@common/guards/is-not-empty-object.decorator';
import { v4 as uuidv4 } from 'uuid';
export class CreateEvidenceDto {
  @IsOptional()
  @IsUUID('4', { message: 'El id de la evidencia debe ser un UUID' })
  public _id: string;

  @IsString({ message: 'La decripción debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  public description: string;

  @IsString({ message: 'El campo related debe ser un string' })
  @IsNotEmptyObject({ message: 'El campo related debe ser un objeto y no debe estar vacío' })
  public related: string;

  @IsOptional()
  @IsString({ message: 'El campo url debe ser un string' })
  public url: string;

  @IsOptional()
  @IsString({ message: 'El campo nombre debe ser un string' })
  public file_name: string;

  @IsOptional()
  @IsString({ message: 'El campo tipo de contenido debe ser un string' })
  public content_type: string;

  constructor() {
    this._id = this._id || uuidv4();
  }
}


