import { Module } from '@nestjs/common';
import { UnitMeasurementService } from '@unit_measurement/unit_measurement.service';
import { UnitMeasurementController } from '@unit_measurement/unit_measurement.controller';
import { NatsModule } from '@app/transports/nats.module';
import { DataBaseManagerModule } from '@app/db_manager/db_manager.module';
@Module({
  imports: [
    DataBaseManagerModule,
    NatsModule
  ],
  controllers: [UnitMeasurementController],
  providers: [UnitMeasurementService],
  exports:[UnitMeasurementService],
})
export class UnitMeasurementModule {}
