import { Module } from '@nestjs/common';
import { AlertsModule } from '@alerts/alerts.module';
import { EventsModule } from '@events/events.module';
import { EventsConfModule } from '@eventsconfig/conf_events.module';
import { EventTypesModule } from '@event_types/event_types.module';
import { EventsRoutesModule} from '@event_routes/events_routes.module';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [
    AlertsModule,
    EventsModule,
    EventsConfModule,
    EventTypesModule,
    EventsRoutesModule,
    DataBaseManagerModule
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
