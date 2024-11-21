import {
  IsBoolean,
  IsNumber,
  IsPositive,
  IsString,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class CreateRouteDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  readonly name: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  @MaxLength(255, {
    message: 'La descripción no puede exceder los 255 caracteres',
  })
  readonly description: string;

  @IsNumber()
  @IsPositive({ message: 'La versión debe ser un número positivo' })
  readonly version: number;

  @IsBoolean()
  readonly status: boolean;
}
