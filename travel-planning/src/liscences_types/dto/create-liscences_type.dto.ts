import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateLiscencesTypeDto {
  @IsOptional()
  @IsUUID('4', {
    message: 'El id_liscences_type debe ser un UUID válido',
  })
  public id_liscences_type?: string;

  @IsString({
    message: 'El nombre debe ser un string',
  })
  public name: string;

  @IsBoolean({
    message: 'El estado debe ser un valor booleano',
  })
  public status: boolean;
}
