import { Module } from '@nestjs/common';
import { TripsService } from '@trips/trips.service';
import { TripsController } from '@trips/trips.controller';
import { TripTypesModule } from '@trip_types/trip_types.module';
import { JourneyTypesModule } from '@journey-types/journey-types.module';
import { CarriersModule } from '@carriers/carriers.module';
import { RoutesModule } from '@routes/routes.module';
import { ClientsModule } from '@clients/clients.module';
import { PhasesModule } from '@phases/phases.module';
import { StatusModule } from '@status/status.module';
import { DriversModule } from '@drivers/drivers.module';
import { PlacesModule } from '@places/places.module';
import { NatsModule } from '@app/transports/nats.module';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TripTypesModule,
    JourneyTypesModule,
    CarriersModule,
    RoutesModule,
    ClientsModule,
    PhasesModule,
    StatusModule,
    DriversModule,
    PlacesModule,
    NatsModule,
    DataBaseManagerModule,
    HttpModule,
  ],
  controllers: [TripsController],
  providers: [TripsService],
})

export class TripsModule {}
