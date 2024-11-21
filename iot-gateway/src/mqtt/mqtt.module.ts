import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [
    DataBaseManagerModule,
  ],
  providers: [MqttService],
  exports: [MqttService],
})

export class MqttModule {}
