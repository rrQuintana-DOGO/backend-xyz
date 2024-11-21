import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateEventsRouteDto {
  @IsOptional()
  @IsString()
  readonly id_event_route: string;

  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString()
  readonly id_event_type: string;

  @IsOptional()
  @IsBoolean()
  readonly status: boolean;
}
