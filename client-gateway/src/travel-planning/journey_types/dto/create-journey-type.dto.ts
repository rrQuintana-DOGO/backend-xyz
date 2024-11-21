import { IsBoolean, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateJourneyTypeDto {
  @IsOptional()
  @IsString({ message: 'El id de la fase debe ser una cadena de texto' })
  public id_journey_type: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  public name: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  public description: string;

  @IsBoolean({ message: 'El estatus debe ser un valor booleano' })
  public status: boolean;
}