import { 
  IsString, 
  IsNumber, 
  IsOptional,
  IsUUID, 
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export class CreateTripLogDto {
  @IsOptional()
  @IsUUID(null, { message: 'El id de notificación debe ser un UUID' })
  public _id: string;

  @IsUUID('4', { message: 'El id_trip debe ser un UUID' })
  public id_trip?: string;

  @IsUUID('4', { message: 'El id_user debe ser un UUID' })
  public id_user?: string;

  @IsUUID('4', { message: 'El id_status debe ser un UUID' })
  public id_status?: string;

  @IsUUID('4', { message: 'La id_situation debe ser un UUID' })
  public id_situation?: string;

  @IsString({ message: 'El comment debe ser una cadena de texto' })
  public comment?: string;

  @IsNumber({}, { message: 'La created_at debe ser un número' })
  public created_at?: bigint;

  constructor() {
    this._id = this._id || uuidv4();
  }
}