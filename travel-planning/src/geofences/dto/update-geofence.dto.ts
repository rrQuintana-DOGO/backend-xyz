import { PartialType } from '@nestjs/mapped-types';
import { CreateGeofenceDto } from '@geofences/dto/create-geofence.dto';
import { IsUUID } from 'class-validator';

export class UpdateGeofenceDto extends PartialType(CreateGeofenceDto) {
  @IsUUID('4', { message: 'El id_geofence debe ser de tipo UUID' })
  id_geofence: string;
}

