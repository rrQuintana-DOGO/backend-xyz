import { Module } from '@nestjs/common';
import { PlacesTypesController } from '@app/place_types/place_type.controller';
import { PlacesTypesService } from '@places_types/place_type.service';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [
    DataBaseManagerModule
  ],
  exports: [PlacesTypesService],
  controllers: [PlacesTypesController],
  providers: [PlacesTypesService],
})

export class PlaceTypesModule {}
