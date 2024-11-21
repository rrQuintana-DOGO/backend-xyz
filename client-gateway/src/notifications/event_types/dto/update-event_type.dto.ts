import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateEventTypeDto {
  @IsOptional()
  @IsString()
  id_event_type: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsObject({ message: 'Los parámetros deben ser un objeto' })
  @IsNotEmpty({ message: 'Los parámetros no pueden estar vacíos' })
  @Type(() => Object)
  params: object;

  @IsOptional()
  @IsBoolean()
  status: boolean;
}
