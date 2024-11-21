import { Module } from '@nestjs/common';
import { PlacesController } from '@places/places.controller';
import { PlacesService } from '@places/places.service';
import { PlaceTypesModule } from '@places_types/place_type.module';
import { GeofencesModule } from '@geofences/geofence.module';
import { NatsModule } from '@app/transports/nats.module';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [
    PlaceTypesModule,
    GeofencesModule,
    NatsModule,
    DataBaseManagerModule,
  ],
  controllers: [PlacesController],
  providers: [PlacesService],
  exports: [PlacesService],
})

export class PlacesModule {}
