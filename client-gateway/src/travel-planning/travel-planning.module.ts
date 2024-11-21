import { Module } from '@nestjs/common';
import { ClientsController } from './clients/clients.controller';
import { LiscencesTypesController } from './liscences_types/liscences_types.controller';
import { DriversController } from './drivers/drivers.controller';
import { TripTypesController } from './trip_types/trip_types.controller';
import { RoutesController } from './routes/routes.controller';
import { CarriersController } from './carriers/carriers.controller';
import { PlaceTypesController } from './place_types/places_types.controller';
import { PlacesController } from './places/places.controller';
import { GeofencesController } from '@travel-planning/geofences/geofence.controller';
import { ContactsController } from '@travel-planning/contacts/contacts.controller';
import { PhasesController } from '@travel-planning/phases/phases.controller';
import { JourneyTypesController } from '@travel-planning/journey_types/journey-types.controller';
import { StatussController } from '@travel-planning/status/status.controller';
import { TripsController } from '@travel-planning/trips/trips.controller';
import { EvidencesController } from '@travel-planning/evidences/evidences.controller';
import { NatsModule } from '@app/transports/nats.module';
import { StorageModule } from '@storage/storage.module';
import { SituationsController } from '@travel-planning/situations/status.controller';
import { TripLogsController } from '@travel-planning/trip_logs/trip_logs.controller';
import { TransformExcelService } from '@travel-planning/trips/services/transform-excel.service';
import { DataBaseTravelPlanningManagerController } from '@travel-planning/db_manager/db_manager.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '@app/config';

@Module({
  controllers: [
    RoutesController,
    ClientsController,
    LiscencesTypesController,
    DriversController,
    TripTypesController,
    CarriersController,
    PlaceTypesController,
    PlacesController,
    ContactsController,
    GeofencesController,
    PhasesController,
    JourneyTypesController,
    StatussController,
    TripsController,
    EvidencesController,
    SituationsController,
    TripLogsController,
    DataBaseTravelPlanningManagerController,
  ],
  providers: [TransformExcelService],
  imports: [
    NatsModule, 
    StorageModule,
    JwtModule.register({
      secret: envs.secretKeyToken,
      signOptions: { expiresIn: '1h' },
    })
  ],
})

export class TravelPlanningModule {}
