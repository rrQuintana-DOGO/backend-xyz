import {
  IsBoolean,
  IsObject,
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CreateEventDto {
  @IsOptional()
  @IsString({ message: 'El id del evento debe ser una cadena de texto' })
  public id_event: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre no debe estar vacío' })
  public name: string;

  @IsObject({ message: 'Los params deben ser un objeto' })
  public params: object;

  @IsString({ message: 'La descripción debe ser una cadena de texto', always: true })
  @IsNotEmpty({ message: 'La descripción no debe estar vacía' })
  public description: string;

  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  public status: boolean;
}