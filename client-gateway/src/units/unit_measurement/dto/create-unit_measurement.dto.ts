import { IsBoolean, IsObject, IsString } from 'class-validator';

export class CreateUnitMeasurementDto {
  @IsString()
  public name: string;

  @IsString()
  public symbol: string;

  @IsObject()
  public conversion: object;

  @IsBoolean()
  public status: boolean;
}
