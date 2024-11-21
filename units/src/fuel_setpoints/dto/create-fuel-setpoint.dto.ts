import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsString, IsOptional, IsUUID, Matches } from 'class-validator';

export class CreateFuelSetpointDto {
  @IsOptional()
  //@IsString({message: 'El id del lugar debe ser una cadena de texto'})
  @IsUUID('4', { message: 'El id del setpoint debe ser de tipo UUID' })
  public id_fuel_setpoint: string;

  
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'setpoint debe ser un número flotante válido' },
  )
  public setpoint?: number;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'minimum_range debe ser un número flotante válido' },
  )
  public minimum_range?: number;

  @IsOptional()
  @IsString()
  
  @Matches(/^\d+:[0-5]\d:[0-5]\d$/, {
    message: 'El tiempo debe estar en formato HH:mm:ss, donde HH puede ser cualquier número de horas',
  })
  
  public periodic_alert?: string;
  

  @IsUUID('4', { message: 'El id_unit_measure debe ser de tipo UUID' })
  public id_unit_measure?: string;

  @IsBoolean({ message: 'status debe ser un valor booleano' })
  public status?: boolean;
}

/*
model fuel_setpoints {
  id_fuel_setpoint       String                   @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  setpoint               Float?                   @db.Real
  minimum_range          Float?                   @db.Real
  periodic_alert         DateTime?                @db.Time(6) //Falta
  id_unit_measure        String?                  @db.Uuid
  status                 Boolean?
}
*/