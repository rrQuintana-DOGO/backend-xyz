import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ExcelTripDriversDto {
  @IsNumber({}, { message: 'El id del viaje debe ser un número' })
  @IsNotEmpty({ message: 'El id del viaje no puede estar vacío' })
  public ID_VIAJE: string;

  @IsString({ message: 'El nombre del conductor debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del conductor no puede estar vacío' })
  public NOMBRE_DEL_CONDUCTOR: string;
}