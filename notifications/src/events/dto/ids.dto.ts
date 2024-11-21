// ids.dto.ts
import { IsArray, IsString } from 'class-validator';

export class IdsDto {
    @IsArray()
    events: string[];

    @IsString()
    property: string;

    @IsString()
    slug: string;
}