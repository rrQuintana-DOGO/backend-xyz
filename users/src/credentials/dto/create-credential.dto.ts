import { IsString, IsOptional} from 'class-validator';

export class CreateCredentialDto {
  @IsOptional()
  @IsString()
  public id_credential: string;

  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  public username: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  public password: string;

  @IsString({ message: 'El tipo de inicio de sesión debe ser una cadena de texto' })
  public login_type: string;
}
