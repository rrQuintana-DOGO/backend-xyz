import { Module } from '@nestjs/common';
import { JorneyTypesController } from '@journey-types/journey-types.controller';
import { JorneyTypeService } from '@journey-types/journey-types.service';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [
    DataBaseManagerModule
  ],
  controllers: [JorneyTypesController],
  providers: [JorneyTypeService],
  exports: [JorneyTypeService],
})

export class JourneyTypesModule {}
