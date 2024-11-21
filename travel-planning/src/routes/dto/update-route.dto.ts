import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateRouteDto {
  @IsString()
  readonly id: string;

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly version?: number;

  @IsOptional()
  @IsBoolean()
  readonly status?: boolean;
}
