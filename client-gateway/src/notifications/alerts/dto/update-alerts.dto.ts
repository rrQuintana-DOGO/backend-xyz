import { PartialType } from '@nestjs/mapped-types';
import { CreateAlertDto } from '@notifications/alerts/dto/create-alerts.dto';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdateAlertDto extends PartialType(CreateAlertDto) {
  @IsUUID('4', { message: 'El id de la notificación debe ser un UUID válido' })
  _id: string;

  @IsUUID(null, { message: 'El id de la unidad debe ser un UUID' })
  id_unit: string;

  @IsUUID(null, { message: 'El id del viaje debe ser un UUID' })
  id_trip: string;

  @IsUUID(null, { message: 'El id del evento debe ser un UUID' })
  id_event: string;

  @IsUUID(null, { message: 'El id del registro de viaje debe ser un UUID' })
  id_trip_log: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'La fecha de registro debe ser un número' })
  register_date: number;
}