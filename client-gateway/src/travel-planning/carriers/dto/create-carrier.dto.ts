import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCarrierDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es un campo obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  name: string;

  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El teléfono es un campo obligatorio' })
  phone: string;

  @IsString({ message: 'El correo electrónico debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El correo electrónico es un campo obligatorio' })
  @IsEmail({}, { message: 'El correo electrónico debe ser un correo válido' })
  email: string;

  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La dirección es un campo obligatorio' })
  @MaxLength(255, {
    message: 'La dirección no puede exceder los 255 caracteres',
  })
  address: string;

  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  status: boolean;
}
