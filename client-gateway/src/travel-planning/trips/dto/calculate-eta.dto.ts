import { IsArray, IsNumber, ValidateNested, ArrayNotEmpty, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

class PlaceDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;

  @IsNumber()
  arrive_date: number;

  @IsNumber()
  departure_date: number;
}

export class CalculateEtaDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PlaceDto)
  places: PlaceDto[];

  @IsNumber()
  @IsPositive()
  speed: number;
}