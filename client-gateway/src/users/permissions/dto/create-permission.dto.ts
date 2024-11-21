import { IsBoolean, IsObject, IsString, IsOptional,  IsNotEmpty } from 'class-validator';
import { IsNotEmptyObject } from '@common/index'
export class CreatePermissionDto {
  @IsOptional()
  @IsString({message: 'El id del permiso debe ser una cadena de texto'})
  public id_permission: string;

  @IsString({message: 'El nombre del permiso debe ser una cadena de texto'})
  @IsNotEmpty({message: 'El nombre del permiso no puede estar vacío'})
  public name: string;

  @IsObject({message: 'Los parámetros del permiso deben ser un objeto'})
  @IsNotEmptyObject({message: 'Los parámetros del permiso no pueden estar vacíos'})
  public params: object;

  @IsBoolean({message: 'El estado del permiso debe ser un booleano'})
  public status: boolean;
}
