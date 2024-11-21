import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateCarrierDto {
  @IsString()
  readonly id_carrier: string;

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly phone?: string;

  @IsOptional()
  @IsString()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsBoolean()
  readonly status?: boolean;
}
