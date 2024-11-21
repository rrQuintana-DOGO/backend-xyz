import {  IsString, IsOptional, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateStatusDto {
  @IsOptional()
  @IsString({ message: 'El id del estatus debe ser una cadena de texto' })
  public id_status: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  public name: string;

  @IsBoolean({ message: 'El estatus debe ser un valor booleano' })
  public status: boolean;
}