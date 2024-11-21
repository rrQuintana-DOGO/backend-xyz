import { IsString, IsOptional, IsUUID} from 'class-validator';

export class CreateTripHasUnitDto {
  @IsOptional()
  @IsString()
  public id_has_units: string;

  @IsUUID('4', { message: 'El id de la unidad debe ser un UUID válido' })
  public id_unit: string;

  @IsUUID('4', { message: 'El id del viaje debe ser un UUID válido' })
  public id_setpoint: string;
}
