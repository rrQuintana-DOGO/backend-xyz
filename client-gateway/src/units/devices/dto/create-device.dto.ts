import { IsBoolean, IsString, IsOptional, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateDeviceDto {
  @IsOptional()
  @IsString({ message : 'El id del dispositivo debe ser un string' })
  public id_device: string;

  @IsUUID('4', { message: 'El id_device debe ser de tipo UUID' })
  public id_device_type: string;

  @IsString({ message : 'El imei del dispositivo debe ser un string' })
  @IsNotEmpty({ message : 'El imei del dispositivo no puede estar vacío' })
  public imei : string;

  @IsString({ message : 'El nombre del dispositivo debe ser un string' })
  @IsNotEmpty({ message : 'El nombre del dispositivo no puede estar vacío' })
  public name : string;

  @IsString({ message : 'El id ext del dispositivo debe ser un string' })
  @IsNotEmpty({ message : 'El id ext del dispositivo no puede estar vacío' })
  public id_ext: string;

  @IsBoolean({ message : 'El estado del dispositivo debe ser un valor booleano' })
  public status: boolean;

  @IsOptional()
  @IsArray({message: 'Los grupos deben ser un arreglo de cadenas de texto'})
  @IsString({ each: true , message: 'Cada grupo debe ser una cadena de texto' })
  public groups?: string[];
}