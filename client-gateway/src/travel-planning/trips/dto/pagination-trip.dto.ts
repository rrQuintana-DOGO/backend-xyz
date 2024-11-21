import { TabEnum } from '@travel-planning/phases/entities/phases.enum';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  Max,
  Min,
  IsEnum,
  IsString,
} from 'class-validator';

export class PaginationTripDto {
  @IsPositive({ message: 'La página debe ser un número positivo' })
  @IsOptional()
  @IsInt({ message: 'La página debe ser un número entero' })
  @Type(() => Number)
  @Min(1, { message: 'La página debe ser mayor a 0' })
  page?: number = 1;

  @IsPositive({ message: 'El límite debe ser un número positivo' })
  @IsOptional()
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Type(() => Number)
  @Min(1, { message: 'El límite debe ser mayor a 0' })
  @Max(100, { message: 'El límite debe ser menor a 100' })
  limit?: number = 10;

  @IsOptional()
  @IsEnum(TabEnum, {
    message: `La pestaña debe ser uno de los valores permitidos :  ${Object.values(TabEnum).join(', ')}`,
  })
  tab?: TabEnum;

  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser una cadena de texto' })
  search?: string;

  @IsOptional()
  @IsString({ message: 'El status debe ser una cadena de texto' })
  status?: string;

  @IsOptional()
  @IsString({ message: 'El cliente debe ser una cadena de texto' })
  client?: string;

  @IsOptional()
  @IsString({ message: 'El transportista debe ser una cadena de texto' })
  carrier?: string;

  @IsOptional()
  @IsString({ message: 'El lugar debe ser una cadena de texto' })
  place?: string;
}
