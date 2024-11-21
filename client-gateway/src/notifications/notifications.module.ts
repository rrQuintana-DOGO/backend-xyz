import { AlertsController } from '@notifications/alerts/alerts.controller';
import { EventsController } from '@notifications/event/event.controller';
import { EventsConfController } from '@notifications/conf_event/conf_event.controller';
import { Module } from '@nestjs/common';
import { NatsModule } from '@app/transports/nats.module';
import { EventTypesController } from '@notifications/event_types/event_types.controller';
import { EventsRoutesController } from '@notifications/events_routes/events_routes.controller';
import { DataBaseManagerController } from '@notifications/db_manager/db_manager.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '@app/config';

@Module({
  controllers: [
    AlertsController, 
    EventsConfController,
    EventsController,
    EventTypesController,
    EventsRoutesController,
    DataBaseManagerController
  ],
  providers: [],
  imports: [
    NatsModule,
    JwtModule.register({
      secret: envs.secretKeyToken,
      signOptions: { expiresIn: '1h' },
    })
  ],
})

export class NotificationsModule {};
