import { 
  IsString, 
  IsBoolean, 
  IsOptional, 
  IsArray,
  IsNotEmpty, 
} from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @IsOptional()
  public id_module: string;

  @IsString({ message: 'El nombre del módulo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del módulo no puede estar vacío' })
  public name: string;

  @IsBoolean()
  public status: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Los permisos del módulo deben ser cadenas de texto' })
  @IsNotEmpty({ each: true, message: 'Cada permiso no puede estar vacío' })
  public permissions?: string[];
}