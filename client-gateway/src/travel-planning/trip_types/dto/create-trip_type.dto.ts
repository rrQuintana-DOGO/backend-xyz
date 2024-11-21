import { IsString, IsBoolean } from 'class-validator';

export class CreateTripTypeDto {
  @IsString({ message: 'El nombre es requerido' })
  public name?: string;

  @IsString({ message: 'La descripción es requerida' })
  public description?: string;

  @IsBoolean({ message: 'El status debe ser un valor booleano' })
  public status?: boolean;
}
