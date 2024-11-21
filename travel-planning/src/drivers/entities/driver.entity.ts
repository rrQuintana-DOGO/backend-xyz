import { IsString, IsOptional, IsDate, IsEmail } from 'class-validator';

export class Driver {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  rc_code: string;

  @IsOptional()
  @IsString()
  license_types?: string;

  @IsOptional()
  @IsDate()
  license_expiration?: Date;
}
