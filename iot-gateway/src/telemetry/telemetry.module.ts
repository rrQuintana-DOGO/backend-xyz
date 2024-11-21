import { Module } from '@nestjs/common';
import { NatsModule } from '@app/transports/nats.module';
import { DataBaseManagerModule } from '@app/db_manager/db_manager.module';
import { TelemetryService } from '@telemetry/telemetry.service';
import { TelemetryController } from '@telemetry/telemetry.controller';

@Module({
  imports: [
    DataBaseManagerModule,
    NatsModule
  ],
  exports: [TelemetryService],
  controllers: [TelemetryController],
  providers: [TelemetryService],
})

export class TelemetryModule {}
