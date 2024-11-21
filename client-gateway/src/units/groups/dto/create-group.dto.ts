import { Type } from 'class-transformer';
import { IsBoolean, IsString, IsOptional, ValidateNested, IsNotEmpty } from 'class-validator';
import { CreateConfGroupDto } from '@units/conf_groups/dto/create-conf_groups.dto';
export class CreateGroupDto {
  @IsOptional()
  @IsString({ message : 'El id del grupo debe ser una cadena de texto' })
  public id_group: string;

  @IsString({ message : 'El nombre del grupo debe ser una cadena de texto' })
  @IsNotEmpty({ message : 'El nombre del grupo no debe estar vacío' })
  public name : string;

  @ValidateNested({ message : 'La configuración del grupo debe ser un objeto' })
  @Type(() => CreateConfGroupDto)
  public configuration?: CreateConfGroupDto;

  @IsString({ message : 'El id de la configuración del grupo debe ser una cadena de texto' })
  @IsOptional()
  public id_config_group: string;

  @IsBoolean({ message : 'El estado del grupo debe ser un valor booleano' })
  public status: boolean;
}

