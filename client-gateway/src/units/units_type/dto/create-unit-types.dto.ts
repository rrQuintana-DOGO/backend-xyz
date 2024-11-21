import { IsBoolean, IsString, IsNumber, IsOptional, Min, IsNotEmpty } from 'class-validator';

export class CreateUnitTypeDto {
  @IsOptional()
  @IsString({ message: 'El id_unit_type debe ser una cadena de texto' })
  public id_unit_type: string;

  @IsNotEmpty({ message: 'El nombre del tipo de unidad no debe estar vacío' })
  @IsString({ message: 'El name debe ser una cadena de texto' })
  public name: string;
  

  @IsNumber({}, { message: 'El optimal_fuel_performance debe ser un número' })
  @Min(0, { message: 'El optimal_fuel_performance no puede ser negativo' })
  public optimal_fuel_performance: number;

  @IsBoolean({ message: 'El estado del tipo de unidad debe ser un valor booleano' })
  public status: boolean;
}