import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDatabaseTravelPlanningManagerDto {
  @IsString({ message: 'El nombre debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  public name: string;
}