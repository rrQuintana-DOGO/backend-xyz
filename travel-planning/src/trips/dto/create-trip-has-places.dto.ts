import { IsString, IsOptional, IsUUID, IsNumber } from 'class-validator';

export class CreateTripHasPlacesDto {
  @IsOptional()
  @IsString({ message: 'El id del lugar debe ser una cadena de texto' })
  public id_trip_has_places: string;

  @IsUUID('4', { message: 'El id del lugar debe ser un UUID válido' })
  public id_place: string;

  @IsNumber({}, { message: 'La fecha estimada de llegada debe ser un número' })
  public estimate_arrive_date: bigint;

  @IsOptional()
  @IsNumber({}, { message: 'La fecha real de llegada debe ser un número' })
  public real_arrive_date: bigint;

  @IsNumber({}, { message: 'La fecha estimada de salida debe ser un número' })
  public estimate_departure_date: bigint;

  @IsOptional()
  @IsNumber({}, { message: 'La fecha real de salida debe ser un número' })
  public real_estimate_departure_date: bigint;

  @IsNumber({}, { message: 'La fase debe ser un número' })
  public phase: number;

  @IsNumber({}, { message: 'La action debe ser un número' })
  public action: number;
}