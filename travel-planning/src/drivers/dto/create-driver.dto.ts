import {
  IsDate,
  IsOptional,
  IsString,
  IsEmail,
  Length,
  IsBoolean,
} from 'class-validator';

export class CreateDriverDto {
  @IsString({
    message: 'El nombre debe ser un string',
  })
  @Length(1, 255, {
    message:
      'El nombre debe tener al menos 1 carácter y como máximo 255 caracteres',
  })
  public name: string;

  @IsString({
    message: 'El teléfono debe ser un string',
  })
  @Length(1, 20, {
    message:
      'El teléfono debe tener al menos 1 carácter y como máximo 20 caracteres',
  })
  public phone: string;

  @IsEmail(
    {},
    {
      message: 'El correo electrónico debe ser válido',
    },
  )
  public email: string;

  @IsString({
    message: 'El código RC debe ser un string',
  })
  @Length(1, 50, {
    message:
      'El código RC debe tener al menos 1 carácter y como máximo 50 caracteres',
  })
  public rc_code: string;

  @IsOptional()
  @IsString({
    message: 'Los tipos de licencia deben ser un string',
  })
  @Length(1, 255, {
    message:
      'Los tipos de licencia deben tener al menos 1 carácter y como máximo 255 caracteres',
  })
  public license_types?: string;

  @IsOptional()
  @IsDate({
    message: 'La fecha de vencimiento de la licencia debe ser una fecha válida',
  })
  public license_expiration?: Date;

  @IsBoolean({
    message: 'El estado debe ser un booleano',
  })
  public status: boolean;
}
