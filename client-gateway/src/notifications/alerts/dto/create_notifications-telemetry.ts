import { Type } from 'class-transformer';
import { IsNumber, IsUUID, IsOptional, IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

class LocationDto {
  @IsString({ message: 'La latitud debe ser un string' })
  @IsNotEmpty({ message: 'La latitud no puede estar vacía' })
  lat: string;

  @IsString({ message: 'La longitud debe ser un string' })
  @IsNotEmpty({ message: 'La longitud no puede estar vacía' })
  lon: string;
}
export class CreateNotificationsTelemetryDto { 
  @IsOptional()
  @IsUUID(null, { message: 'El id de notificación debe ser un UUID' })
  public _id: string;

  @IsString({ message : 'El nombre de la alerta debe ser un string' })
  public alert: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'La id_device debe ser un número' })
  public device_id: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El value debe ser un número' })
  public value: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El datetime debe ser un número' })
  public datetime: number;
  /*
  @IsString({ message : 'la latitude debe ser un string' })
  public latitude: string;

  @IsString({ message : 'la longitude debe ser un string' })
  public longitude: string;
  */

  @ValidateNested()
 @Type(() => LocationDto)
 public location: LocationDto;

  @IsUUID(null, { message: 'El event_uuid debe ser un UUID' })
  public event_uuid: string;
 
  @IsUUID(null, { message: 'El client_uuid debe ser un UUID' })
  public client_uuid: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'la duration debe ser un número' })
  public duration: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El datetime debe ser un número' })
  public event_date: number;
  
  constructor() {
    this._id = this._id || uuidv4();
  }
}
