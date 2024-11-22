import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';
import { NatsModule } from '@app/transports/nats.module';

@Module({
  imports: [
    DataBaseManagerModule,
    NatsModule,
  ],
  providers: [MqttService],
  exports: [MqttService],
})

export class MqttModule {}
