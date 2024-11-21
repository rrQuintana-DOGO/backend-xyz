// ids.dto.ts
import { IsArray, IsString } from 'class-validator';

export class IdsDto {
    @IsArray()
    setpoints: string[];

    @IsString()
    property: string;
}