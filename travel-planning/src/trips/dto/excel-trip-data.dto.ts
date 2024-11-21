import { PartialType } from '@nestjs/mapped-types';
import { 
  ExcelTripGeneralDto,
  ExcelTripPlacesDto,
  ExcelTripUnitsDto,
} from '@trips/dto/index';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
export class ExcelTripDataDto extends PartialType(ExcelTripGeneralDto) {
  
  @IsOptional()
  @IsArray({ message: 'Los conductores deben ser un arreglo' })
  @IsString({ each: true, message: 'Cada conductor debe ser una cadena' })
  public CONDUCTORES: string[];

  @IsOptional()
  @IsArray({ message: 'Los eventos deben ser un arreglo' })
  @IsString({ each: true, message: 'Cada evento debe ser una cadena' })
  public EVENTOS: string[];

  @IsOptional()
  @IsArray({ message: 'Los lugares deben ser un arreglo' })
  @ValidateNested({message: 'Los lugares deben ser un objeto anidado'})
  @Type(() => ExcelTripPlacesDto)
  public LUGARES: ExcelTripPlacesDto[];

  @IsOptional()
  @IsArray({ message: 'Las unidades deben ser un arreglo' })
  @ValidateNested({message: 'Las unidades deben ser un objeto anidado'})
  @Type(() => ExcelTripUnitsDto)
  public UNIDADES: ExcelTripUnitsDto[];
}

