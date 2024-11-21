import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateSetpointDto {
  @IsString({ message: 'name debe ser una cadena' })
  public name?: string;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'optimus_temp debe ser un número flotante válido' },
  )
  public optimus_temp?: number;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'minimum_range debe ser un número flotante válido' },
  )
  public minimum_range?: number;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'maximum_range debe ser un número flotante válido' },
  )
  public maximum_range?: number;

  @IsString({ message: 'id_unit_measurement debe ser una cadena' })
  id_unit_measurement?: string;

  @IsBoolean({ message: 'status debe ser un valor booleano' })
  status?: boolean;
}
