import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class CreateEventsRouteDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsUUID('4', { message: 'El id del evento debe ser un UUID' })
  readonly event_type: string;

  @IsBoolean({ message: 'El estatus debe ser un valor booleano' })
  readonly status: boolean;
}
