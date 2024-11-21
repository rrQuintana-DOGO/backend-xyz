import { IsBoolean, IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsOptional()
  @IsString({message: 'El id del rol debe ser una cadena de texto'})
  public id_role: string;

  @IsString({message: 'El nombre del rol debe ser una cadena de texto'})
  @IsNotEmpty({message: 'El nombre del rol no puede estar vacío'})
  public name: string;

  @IsString({message: 'La descripción del rol debe ser una cadena de texto'})
  @IsNotEmpty({message: 'La descripción del rol no puede estar vacía'})
  public description: string;

  @IsOptional()
  @IsArray({message: 'Los permisos deben ser un arreglo de cadenas de texto'})
  @IsString({ each: true, message: 'Los permisos deben ser cadenas de texto' })
  @IsNotEmpty({ each: true, message: 'Cada permiso no puede estar vacío' })
  public permissions?: string[];

  @IsBoolean({message: 'El estado del rol debe ser un valor booleano'})
  public status: boolean;
}
