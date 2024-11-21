import { IsBoolean, IsString, IsNumber, IsOptional, IsNotEmpty, IsJSON, IsUUID, IsObject} from 'class-validator';

export class CreateGeofenceDto {
  @IsOptional()
  @IsString({ message : 'El id_unit_type debe ser una cadena de texto' })
  public id_geofence: string;

  /*
  @IsJSON({ message: 'El campo coords debe ser un JSON válido' })
  @IsNotEmpty({ message: 'El campo coords no debe estar vacío' })
  public coords: string;
 */

  @IsObject({ message: 'Los params deben ser un objeto' })
  public coords: object;

  @IsBoolean({ message : 'El estado de la geocerca debe ser un valor booleano' })
  public status: boolean;

  @IsString({ message : 'El name debe ser una cadena de texto' })
  @IsNotEmpty({ message : 'El nombre de la geocerca no debe estar vacío' })
  public name: string;

  @IsOptional()
  @IsUUID('4', { message: 'El id_geofence_type debe ser de tipo UUID' })
  public id_geofence_type: string;

}
