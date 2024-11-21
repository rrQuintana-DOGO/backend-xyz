import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ExcelTripUnitsDto {
  @IsNumber({}, { message: 'El id del viaje debe ser un número' })
  @IsNotEmpty({ message: 'El id del viaje no puede estar vacío' })
  public ID_VIAJE: string;
  
  @IsString({ message: 'El nombre de la unidad debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de la unidad no puede estar vacío' })
  public NOMBRE_DE_LA_UNIDAD: string;

  @IsString({ message: 'La variable deseada debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La variable deseada no puede estar vacía' })
  public VARIABLE_DESEADA: string;

}