import { IsBoolean, IsObject, IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';
import { IsNotEmptyObject } from '@common/guards/is-not-empty-object.decorator';
export class CreateEventConfDto {
  @IsOptional({ message: 'El campo id_conf_evento es opcional.' })
  @IsString({ message: 'El campo id_conf_evento debe ser una cadena de texto.' })
  public id_conf_event: string;

  @IsUUID('4', { message: 'El campo id_evento debe ser un UUID.' })
  public id_event: string;

  @IsObject({ message: 'El campo json debe ser un objeto.' })
  @IsNotEmptyObject({ message: 'El campo json no debe estar vacío.' })
  public json_data: object;

  @IsBoolean({ message: 'El campo estado debe ser un valor booleano.' })
  public status: boolean;
}