import { Module } from '@nestjs/common';
import { ClientsModule } from '@clients/clients.module';
import { LiscencesTypesModule } from '@liscences_types/liscences_types.module';
import { DriversModule } from '@drivers/drivers.module';
import { TripTypesModule } from '@trip_types/trip_types.module';
import { RoutesModule } from '@routes/routes.module';
import { CarriersModule } from '@carriers/carriers.module';
import { ContactsModule } from '@contacts/contacts.module';
import { PhasesModule } from '@phases/phases.module';
import { JourneyTypesModule } from '@journey-types/journey-types.module';
import { StatusModule } from '@status/status.module';
import { TripsModule } from '@trips/trips.module';
import { EvidencesModule } from '@evidences/evidences.module';
import { GeofencesModule } from '@geofences/geofence.module';
import { PlaceTypesModule } from '@places_types/place_type.module';
import { PlacesModule } from '@places/places.module';
import { SituationsModule } from '@situations/situations.module';
import { TripLogsModule } from '@trip_logs/trip_logs.module';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [
    ClientsModule,
    LiscencesTypesModule,
    DriversModule,
    TripTypesModule,
    RoutesModule,
    CarriersModule,
    ContactsModule,
    PhasesModule,
    JourneyTypesModule,
    StatusModule,
    TripsModule,
    EvidencesModule,
    GeofencesModule,
    PlaceTypesModule,
    PlacesModule,
    SituationsModule,
    TripLogsModule,
    DataBaseManagerModule
  ],
  controllers: []
})

export class AppModule {}
