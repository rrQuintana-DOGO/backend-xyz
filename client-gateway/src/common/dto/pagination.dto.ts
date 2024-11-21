import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsInt({ message: 'La página debe ser un número entero' })
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Type(() => Number)
  @Max(100, { message: 'El límite debe ser menor a 100' })
  limit?: number = 10;
}
