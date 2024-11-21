import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsArray, 
  IsNotEmpty,
  IsUUID,
  ValidateNested, 
} from 'class-validator';
import { CreateTripHasUnitDto } from './create-trip-has-units.dto';
import { Type } from 'class-transformer';
import { CreateTripHasPlacesDto } from './create-trip-has-places.dto';

export class CreateTripDto {
  @IsString({ message: 'El id del viaje debe ser una cadena de texto' })
  @IsOptional()
  public id_trip?: string;

  @IsString({ message: 'El id externo del viaje debe ser una cadena de texto' })
  @IsOptional()
  public id_ext?: string;

  @IsUUID('4', { message: 'El id del tipo de viaje debe ser un UUID' })
  public id_trip_type?: string;

  @IsUUID('4', { message: 'El id del tipo de recorrido debe ser un UUID' })
  public id_journey_type?: string;

  @IsUUID('4', { message: 'El id del transportista debe ser un UUID' })
  public id_carrier?: string;

  @IsNumber({}, { message: 'El tiempo estimado de llegada debe ser un número' })
  public eta?: bigint;

  @IsUUID('4', { message: 'El id de la ruta debe ser un UUID' })
  public id_route?: string;

  @IsUUID('4', { message: 'El id del cliente debe ser un UUID' })
  public id_client?: string;

  @IsNumber({}, { message: 'El tiempo estimado de salida debe ser un número' })
  public eda?: number;

  @IsUUID('4', { message: 'El id de la fase debe ser un UUID' })
  public id_phase?: string;

  @IsUUID('4', { message: 'El id del estado debe ser un UUID' })
  public id_status?: string;

  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
    { message: 'La distancia debe ser un número' }
  )
  public kilometers?: number;

  @IsString({ message: 'La descripción del viaje debe ser una cadena de texto' })
  @IsOptional()
  public description?: string;

  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
    { message: 'El tamaño de la carga debe ser un número' }
  )
  public load_size?: number;

  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
    { message: 'El nivel de combustible al inicio del viaje debe ser un número' }
  )
  public fuel_level_start?: number;

  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
    { message: 'El nivel de combustible al final del viaje debe ser un número' }
  )
  public fuel_level_end?: number;

  @IsOptional()
  @IsNumber({}, { message: 'La fecha de creación debe ser un número' })
  public created_at?: bigint;

  @IsOptional()
  @IsNumber({}, { message: 'La fecha de eliminación debe ser un número' })
  public deleted_at?: bigint;

  @IsOptional()
  @IsArray({ message: 'Los eventos deben ser un arreglo' })
  @IsString({ each: true, message: 'Cada evento debe ser una cadena de texto' })
  public events?: string[];

  @IsOptional()
  @IsArray({ message: 'Los lugares deben ser un arreglo' })  
  @ValidateNested({message: 'Los lugares deben ser un objeto anidado'})
  @Type(() => CreateTripHasPlacesDto)
  public places?: CreateTripHasPlacesDto[];

  @IsOptional()
  @IsArray({ message: 'Los conductores deben ser un arreglo' })
  @IsString({ each: true, message: 'Cada conductor debe ser una cadena de texto' })
  public drivers?: string[];

  @IsOptional()
  @IsArray({ message: 'Las unidades y setpoints deben ser un arreglo' })  
  @ValidateNested({message: 'Las unidades y setpoints deben ser un objeto anidado'})
  @Type(() => CreateTripHasUnitDto)
  public units_setpoints?: CreateTripHasUnitDto[];
}