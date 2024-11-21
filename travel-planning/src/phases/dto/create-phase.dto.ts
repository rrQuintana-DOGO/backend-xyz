import { IsBoolean, IsString, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { TabEnum } from '@phases/entities/phases.enum';

export class CreatePhaseDto {
  @IsOptional()
  @IsString({ message: 'El id de la fase debe ser una cadena de texto' })
  public id_phase: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  public name: string;

  @IsEnum(TabEnum, { message: `La pestaña debe ser uno de los valores permitidos :  ${Object.values(TabEnum).join(', ')}` })
  symbol: TabEnum;

  @IsBoolean({ message: 'El estatus debe ser un valor booleano' })
  public status: boolean;
}