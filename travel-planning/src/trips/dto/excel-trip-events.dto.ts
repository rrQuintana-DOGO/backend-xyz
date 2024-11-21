import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ExcelTripEventsDto {
  @IsNumber({}, { message: 'El id del evento debe ser un número' })
  @IsNotEmpty({ message: 'El id del viaje no puede estar vacío' })
  public ID_VIAJE: string;

  @IsString({ message: 'El nombre del evento debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del evento no puede estar vacío' })
  public NOMBRE_DEL_EVENTO: string;
}