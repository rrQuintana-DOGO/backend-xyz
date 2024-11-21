import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmailMessageDto {
  @IsEmail({}, { message: 'El campo para debe ser un correo electrónico válido.' })
  @IsNotEmpty({ message: 'El campo para no debe estar vacío.' })
  public to: string;

  @IsString({ message: 'El campo título debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El campo título no debe estar vacío.' })
  public title: string;

  @IsString({ message: 'El campo asunto debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El campo asunto no debe estar vacío.' })
  public subject: string;

  @IsString({ message: 'El campo contenido debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El campo contenido no debe estar vacío.' })
  public content: string;
}