import { 
  IsString, 
  IsEmail, 
  IsBoolean, 
  IsOptional, 
  IsArray, 
  ValidateNested, 
  IsNotEmpty,
  IsUUID
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCredentialDto } from '@users/credentials/dto/create-credential.dto';
export class CreateUserDto {
  @IsString({ message: 'El id del usuario debe ser una cadena de texto' })
  @IsOptional()
  public id_user: string;

  @IsString({ message: 'El nombre del usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del usuario no puede estar vacío' })
  public name: string;

  @IsOptional()
  @ValidateNested({message: 'Las credenciales deben ser un objeto anidado'})
  @Type(() => CreateCredentialDto)
  public credential?: CreateCredentialDto;

  @IsString({ message: 'El id de las credenciales debe ser una cadena de texto' })
  @IsOptional()
  public id_credential: string;

  @IsEmail({},{message: 'El correo electrónico debe ser una dirección de correo electrónico válida'})
  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
  public email: string;

  @IsBoolean({message: 'El estado del correo electrónico debe ser un valor booleano'})
  public email_verified: boolean = false;

  @IsString({message: 'El número de teléfono debe ser una cadena de texto'})
  @IsNotEmpty({ message: 'El número de teléfono no puede estar vacío' })
  public phone: string;

  @IsBoolean({message: 'El estado del número de teléfono debe ser un valor booleano'})
  public phone_verified: boolean = false;

  @IsUUID('4', {message: 'El id de la zona horaria debe ser un UUID'})
  public id_time_zone: string;

  @IsOptional()
  @IsArray({message: 'Los permisos deben ser un arreglo'})
  @IsString({ each: true, message: 'Cada permiso debe ser una cadena de texto' })
  @IsNotEmpty({ each: true, message: 'Cada permiso no puede estar vacío' })
  public permissions?: string[];

  @IsOptional()
  @IsArray({message: 'Los roles deben ser un arreglo'})
  @IsString({ each: true , message: 'Cada rol debe ser una cadena de texto'})
  @IsNotEmpty({ each: true, message: 'Cada rol no puede estar vacío' })
  public roles?: string[];
}