import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ExcelTripPlacesDto {
  @IsNumber({}, { message: 'El id del viaje debe ser un número' })
  @IsNotEmpty({ message: 'El id del viaje no puede estar vacío' })
  public ID_VIAJE: string;
  
  @IsString({ message: 'El nombre del lugar debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del lugar no puede estar vacío' })
  public NOMBRE_DEL_LUGAR: string;

  @IsDate({ message: 'La fecha estimada de salida debe ser una fecha' })
  @IsNotEmpty({ message: 'La fecha estimada de salida no puede estar vacía' })
  public FECHA_ESTIMADA_DE_SALIDA: Date;

  @IsDate({ message: 'La fecha estimada de llegada debe ser una fecha' })
  @IsNotEmpty({ message: 'La fecha estimada de llegada no puede estar vacía' })
  public FECHA_ESTIMADA_DE_LLEGADA: Date;

  @IsOptional()
  @IsDate({ message: 'La fecha real de salida debe ser una fecha' })
  public FECHA_REAL_DE_SALIDA: Date;

  @IsOptional()
  @IsDate({ message: 'La fecha real de llegada debe ser una fecha' })
  public FECHA_REAL_DE_LLEGADA: Date;

  @IsNumber({}, { message: 'La fase debe ser un número' })
  @IsNotEmpty({ message: 'La fase no puede estar vacía' })
  public FASE: string;
}