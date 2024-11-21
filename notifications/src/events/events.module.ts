import { Module } from '@nestjs/common';
import { EventsService } from '@events/events.service';
import { EventsController } from '@events/events.controller';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [
    DataBaseManagerModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
