import { IsNotEmptyObject } from '@common/guards/is-not-empty-object.decorator';
import { IsString, IsOptional, IsBoolean, IsObject} from 'class-validator';

export class CreateConfGroupDto {
  @IsOptional()
  @IsString({ message: 'El id de la configuración de grupo debe ser una cadena de texto' })
  public id_config_group: string;

  @IsBoolean({ message: 'El estado de la configuración de grupo debe ser un booleano' })
  public status: boolean;

  @IsObject({ message: 'Los parámetros de la configuración de grupo deben ser un objeto' })
  @IsNotEmptyObject({ message: 'Los parámetros de la configuración de grupo no deben estar vacíos' })
  public parameters: object;
}
