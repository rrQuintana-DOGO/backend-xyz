import { PartialType } from '@nestjs/mapped-types';
import { CreateJourneyTypeDto } from '@travel-planning/journey_types/dto/create-journey-type.dto';
import { IsUUID } from 'class-validator';

export class UpdateJourneyTypeDto extends PartialType(CreateJourneyTypeDto) {
  @IsUUID('4', { message: 'El id del tipo de viaje debe ser un UUID válido' })
  id_journey_type: string;
}

