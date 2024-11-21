import { Module } from '@nestjs/common';
import { EventTypesService } from '@event_types/event_types.service';
import { EventTypesController } from '@event_types/event_types.controller';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [
    DataBaseManagerModule
  ],
  controllers: [
    EventTypesController
  ],
  providers: [EventTypesService],
})

export class EventTypesModule {}