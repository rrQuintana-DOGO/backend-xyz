import { IsUUID } from 'class-validator';

export class CloseAlertDto {
  @IsUUID('4', { message: 'El id_notification debe ser un UUID válido' })
  public id_notification: string;

  @IsUUID('4', { message: 'El id_trip_log_attention debe ser un UUID válido' })
  public id_trip_log_attention: string;
}