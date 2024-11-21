import { PartialType } from '@nestjs/mapped-types';
import { CreateTripDto } from '@trips/dto/create-trip.dto';
import { IsUUID } from 'class-validator';

export class UpdateTripDto extends PartialType(CreateTripDto) {
  @IsUUID('4', { message: 'El identificador del viaje debe ser un UUID válido de versión 4.' })
  id_trip: string;
}
