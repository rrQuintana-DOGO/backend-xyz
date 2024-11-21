import { IsBoolean, IsObject, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventTypeDto {
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  name: string;

  @IsObject({ message: 'Los parámetros deben ser un objeto' })
  @IsNotEmpty({ message: 'Los parámetros no pueden estar vacíos' })
  @Type(() => Object)
  params: object;

  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  @IsNotEmpty({ message: 'El estado no puede estar vacío' })
  status: boolean;
}
