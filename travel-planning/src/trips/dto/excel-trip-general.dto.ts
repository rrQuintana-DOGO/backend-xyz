import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ExcelTripGeneralDto {
  @IsNumber({}, { message: 'El id del viaje debe ser un número' })
  @IsNotEmpty({ message: 'El id del viaje no puede estar vacío' })
  public ID_VIAJE: string;

  @IsString({ message: 'El id externo del viaje debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El id externo del viaje no puede estar vacío' })
  public ID_EXTERNO: string;

  @IsString({ message: 'El tipo de viaje debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El tipo de viaje no puede estar vacío' })
  public TIPO_DE_VIAJE: string;

  @IsString({ message: 'El tipo de recorrido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El tipo de recorrido no puede estar vacío' })
  public TIPO_DE_RECORRIDO: string;

  @IsString({ message: 'La empresa transportista debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La empresa transportista no puede estar vacía' })
  public EMPRESA_TRANSPORTISTA: string;

  @IsNumber({}, { message: 'El tiempo estimado de llegada debe ser un número' })
  public ETA: bigint;

  @IsString({ message: 'La ruta debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La ruta no puede estar vacía' })
  public RUTA: string;

  @IsString({ message: 'El cliente debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El cliente no puede estar vacío' })
  public CLIENTE: string;

  @IsNumber({}, { message: 'El tiempo estimado de salida debe ser un número' })
  public EDA: bigint;

  @IsOptional()
  @IsString({ message: 'La fase debe ser una cadena de texto' })
  public FASE: string;

  @IsString({ message: 'El estatus debe ser una cadena de texto' })
  public ESTATUS: string;

  @IsNumber({}, { message: 'Los kilómetros deben ser un número' })
  public KILOMETROS: bigint;

  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  public DESCRIPCION: string;

  @IsNumber({}, { message: 'El tamaño de carga debe ser un número' })
  public TAMANO_DE_CARGA: bigint;

  @IsNumber({}, { message: 'El nivel de combustible inicial debe ser un número' })
  public NIVEL_DE_COMBUSTIBLE_INICIAL: bigint;

  @IsOptional()
  @IsNumber({}, { message: 'El nivel de combustible final debe ser un número' })
  public NIVEL_DE_COMBUSTIBLE_FINAL: bigint;
}