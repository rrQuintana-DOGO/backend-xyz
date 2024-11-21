import { IsBoolean, IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';

export class CreateClientDto {
  @IsOptional()
  @IsString({ message: 'El id del cliente debe ser una cadena de texto' })
  public id_client: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  public name: string;

  @IsString({ message: 'El nombre de la empresa debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de la empresa no puede estar vacío' })
  public company_name : string;

  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La dirección no puede estar vacía' })
  public address : string;

  @IsOptional()
  @IsArray({ message: 'Los contactos deben ser un arreglo' })
  @IsString({ each: true, message: 'Cada contacto debe ser una cadena de texto' })
  @IsNotEmpty({ each: true, message: 'Cada contacto no puede estar vacío' })
  public contacts?: string[];

  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  public status: boolean;
}