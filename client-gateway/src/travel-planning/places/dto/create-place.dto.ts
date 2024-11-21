import { IsBoolean, IsString, IsOptional, IsUUID,IsNotEmpty, IsArray } from 'class-validator';

export class CreatePlaceDto {
  @IsOptional()
  //@IsString({message: 'El id del lugar debe ser una cadena de texto'})
  @IsUUID('4', { message: 'El id de lugar debe ser de tipo UUID' })
  public id_place: string;

  @IsNotEmpty({ message : 'El id del tipo de lugar no debe estar vacío' })
  @IsUUID('4', { message: 'El id del tipo de lugar debe ser de tipo UUID' })
  public id_place_type: string;

  @IsOptional()
  @IsUUID('4', { message: 'El id_geofence debe ser de tipo UUID' })
  public id_geofence : string;

  @IsNotEmpty({ message : 'El nombre del lugar no debe estar vacío' })
  @IsString({message: 'El nombre del lugar debe ser una cadena de texto'})
  public name : string;

  @IsString({message: 'la locacion lugar debe ser una cadena de texto'})
  public location: string;

  @IsString({message: 'la direccion lugar debe ser una cadena de texto'})
  public address: string;

  @IsOptional()
  @IsArray({ message: 'Los contactos deben ser un arreglo' })
  @IsString({ each: true, message: 'Cada contacto debe ser una cadena de texto' })
  @IsNotEmpty({ each: true, message: 'Cada contacto no puede estar vacío' })
  public contacts?: string[];

@IsBoolean({message: 'El status del lugar debe ser booleano'})
  public status: boolean;
}

/*

 @IsOptional()
  @IsArray({message: 'Los grupos deben ser un arreglo de cadenas de texto'})
  @IsString({ each: true , message: 'Cada grupo debe ser una cadena de texto' })
  public groups?: string[];
  

*/