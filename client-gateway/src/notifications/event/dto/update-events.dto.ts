import { PartialType } from '@nestjs/mapped-types';
import { IsUUID } from 'class-validator';
import { CreateEventDto } from '@notifications/event/dto/create-events.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @IsUUID('4', { message: 'El id_event debe ser un UUID' })
  id_event: string;
}
