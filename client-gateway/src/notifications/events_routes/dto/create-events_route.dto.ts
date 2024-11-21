import {
  IsBoolean,
  IsString,
  IsUUID,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class CreateEventsRouteDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  readonly name: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  @MaxLength(255, {
    message: 'La descripción no puede exceder los 255 caracteres',
  })
  readonly description: string;

  @IsUUID('4', { message: 'El id del evento debe ser un UUID' })
  readonly event_type: string;

  @IsBoolean({ message: 'El estatus debe ser un valor booleano' })
  readonly status: boolean;
}
