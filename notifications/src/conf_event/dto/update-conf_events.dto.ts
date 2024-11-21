import { PartialType } from '@nestjs/mapped-types';
import { IsUUID } from 'class-validator';
import { CreateEventConfDto } from '@eventsconfig/dto/create-conf_events.dto';

export class UpdateEventConfDto extends PartialType(CreateEventConfDto) {
  @IsUUID('4', { message: 'El id del evento de configuración debe ser un UUID' })
  id_conf_event: string;
}
