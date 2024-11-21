import { Module } from '@nestjs/common';
import { TripTypesService } from '@trip_types/trip_types.service';
import { TripTypesController } from '@trip_types/trip_types.controller';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [
    DataBaseManagerModule,
  ],
  controllers: [TripTypesController],
  providers: [TripTypesService],
  exports: [TripTypesService],
})

export class TripTypesModule {}
