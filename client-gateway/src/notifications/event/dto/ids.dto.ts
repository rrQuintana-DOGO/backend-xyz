// ids.dto.ts
import { IsArray } from 'class-validator';

export class IdsDto {
    @IsArray()
    events: string[];
}