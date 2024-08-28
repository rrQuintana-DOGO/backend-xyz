import { IsBoolean, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  public name: string;

  @IsString()
  public description: string;

  @IsBoolean()
  public status: boolean;
}
