import { IsBoolean, IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateFuelTypeDto {
  @IsOptional()
  @IsString({ message : 'El id_fuel_type debe ser una cadena de texto' })
  public id_fuel_type: string;

  @IsString({ message : 'El name debe ser una cadena de texto' })
  @IsNotEmpty({ message : 'El nombre del tipo de combustible no debe estar vacío' })
  public name: string;

  @IsUUID('4', { message: 'El id_unit_measurement debe ser de tipo UUID' })
  public id_unit_measurement: string;

  @IsBoolean({ message : 'El estado del tipo de combustible debe ser un valor booleano' })
  public status: boolean;
}
