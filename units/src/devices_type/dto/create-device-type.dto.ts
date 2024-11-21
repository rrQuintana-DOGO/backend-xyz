import { IsBoolean, IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateDeviceTypeDto {
  @IsOptional()
  @IsString({ message : 'El id del tipo de dispositivo debe ser una cadena de texto' })
  public id_device_type: string;

  @IsString({ message : 'El nombre del tipo de dispositivo debe ser una cadena de texto' })
  @IsNotEmpty({ message : 'El nombre del tipo de dispositivo no debe estar vacío' })
  public name : string;

  @IsBoolean({ message : 'El estado del tipo de dispositivo debe ser un valor booleano' })
  public status: boolean;
}