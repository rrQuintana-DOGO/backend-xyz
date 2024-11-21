import { Module } from '@nestjs/common';
import { AlertsService } from '@alerts/alerts.service';
import { AlertsController } from '@alerts/alerts.controller';
import { NatsModule } from '@app/transports/nats.module';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [
    DataBaseManagerModule, 
    NatsModule 
  ],
  controllers: [AlertsController],
  providers: [AlertsService],
})

export class AlertsModule {}
