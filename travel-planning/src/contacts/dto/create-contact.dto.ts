import { IsBoolean, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateContactDto {
  @IsOptional()
  @IsString({ message: 'El id del contacto debe ser una cadena de texto' })
  public id_contact: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  public name: string;

  @IsString({ message: 'El correo electrónico debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
  public email: string;

  @IsString({ message: 'El número de teléfono debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El número de teléfono no puede estar vacío' })
  public phone: string;

  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La dirección no puede estar vacía' })
  public address: string;

  @IsString({ message: 'El rol debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El rol no puede estar vacío' })
  public role: string;

  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  public status: boolean;
}