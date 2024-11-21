import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsUUID } from 'class-validator';
import { CreateEventConfDto } from '@notifications/conf_event/dto/create-conf_events.dto';

export class UpdateEventConfDto extends PartialType(CreateEventConfDto) {
  @IsUUID('4', { message: 'El id del evento de configuración debe ser un UUID' })
  id_conf_event: string;
}
