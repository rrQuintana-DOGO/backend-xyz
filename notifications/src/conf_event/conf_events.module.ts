import { Module } from '@nestjs/common';
import { EventsConfService } from '@eventsconfig/conf_events.service';
import { EventsConfController } from '@eventsconfig/conf_events.controller';
import { EventsModule } from '@events/events.module';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [
    EventsModule,
    DataBaseManagerModule
  ],
  controllers: [EventsConfController],
  providers: [EventsConfService],
})

export class EventsConfModule {}
