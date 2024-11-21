import { IsArray, IsString } from 'class-validator';

export class IdsDto {
    @IsArray()
    places: string[];

    @IsString()
    property: string;
}