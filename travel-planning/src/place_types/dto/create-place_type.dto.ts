import { IsBoolean, IsString, IsOptional} from 'class-validator';

export class CreatePlaceTypeDto {
  @IsOptional()
  @IsString({message: 'El id del lugar debe ser una cadena de texto'})
  public id_place_type: string;

  @IsString({message: 'El nombre lugar debe ser una cadena de texto'})
  public name: string;

  @IsBoolean({message: 'El status del tipo de lugar debe ser un valor booleano'})
  public status: boolean;

}
