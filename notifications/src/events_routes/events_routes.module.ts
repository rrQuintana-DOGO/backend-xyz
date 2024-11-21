import { Module } from '@nestjs/common';
import { EventsRoutesService } from '@event_routes/events_routes.service';
import { EventsRoutesController } from '@event_routes/events_routes.controller';
import { DataBaseManagerModule } from '@app/db_manager/db_manager.module';

@Module({
  imports: [
    DataBaseManagerModule
  ],
  controllers: [EventsRoutesController],
  providers: [EventsRoutesService],
})
export class EventsRoutesModule {}
