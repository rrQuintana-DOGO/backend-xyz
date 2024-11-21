import { IsNumber, IsUUID, IsOptional } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export class CreateAlertDto {
  @IsOptional()
  @IsUUID(null, { message: 'El id de notificación debe ser un UUID' })
  public _id: string;

  @IsUUID(null, { message: 'El id_unit debe ser un UUID' })
  public id_unit: string;

  @IsUUID(null, { message: 'El id_trip debe ser un UUID' })
  public id_trip : string;

  @IsUUID(null, { message: 'El id_event del evento debe ser un UUID' })
  public id_event : string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'La register_date debe ser un número' })
  public register_date: number;

  @IsUUID(null, { message: 'El id_trip_log debe ser un UUID' })
  public id_trip_log: string;

  constructor() {
    this._id = this._id || uuidv4();
  }
}