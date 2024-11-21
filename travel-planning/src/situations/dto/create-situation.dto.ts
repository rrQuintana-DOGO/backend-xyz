import {  IsString, IsOptional, IsNotEmpty, IsBoolean, IsUUID } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export class CreateSituationDto {
  @IsOptional()
  @IsUUID(null, { message: 'El id_situation debe ser un UUID' })
  public id_situation: string;

  @IsString({ message: 'El name debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El name no puede estar vacío' })
  public name: string;

  @IsBoolean({ message: 'El status debe ser un valor booleano' })
  public status: boolean;

  constructor() {
    this.id_situation = this.id_situation || uuidv4();
    this.status = this.status || true;
  }
}