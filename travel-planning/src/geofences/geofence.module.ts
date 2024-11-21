import { Module } from '@nestjs/common';
import { GeofencesController } from '@geofences/geofence.controller';
import { GeofenceService } from '@geofences/geofence.service';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [
    DataBaseManagerModule
  ],
  exports: [GeofenceService],
  controllers: [GeofencesController],
  providers: [GeofenceService],
})

export class GeofencesModule {}
