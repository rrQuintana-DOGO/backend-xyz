// ids.dto.ts
import { IsArray, IsString } from 'class-validator';

export class IdsDto {
	@IsArray()
	units: string[];

	@IsString()
	property: string;

	@IsString()
	slug: string;
}