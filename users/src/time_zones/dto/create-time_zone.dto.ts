import { IsString, IsOptional, IsNumber, IsBoolean, IsNotEmpty} from 'class-validator';

export class CreateTimeZoneDto {
  @IsOptional()
  @IsString({message: 'El id de la zona horaria debe ser una cadena de texto'})
  public id_time_zone: string;
  
  @IsString({message: 'El nombre de la zona horaria debe ser una cadena de texto'})
  @IsNotEmpty({message: 'El nombre de la zona horaria no debe estar vacío'})
  public name: string;

  @IsNumber(
    {allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2},
    {message: 'El desplazamiento de la zona horaria debe ser un número'}
  )
  public off_set: number;

  @IsBoolean({message: 'El estado de la zona horaria debe ser un valor booleano'})
  public status: boolean;
}
