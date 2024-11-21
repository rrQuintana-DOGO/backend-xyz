import { Module } from '@nestjs/common';
import { MqttModule } from '@mqtt/mqtt.module';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';
import { TelemetryModule } from '@telemetry/telemetry.module';

@Module({
  imports: [
    MqttModule,
    DataBaseManagerModule,
    TelemetryModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
