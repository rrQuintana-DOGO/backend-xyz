import { Module } from '@nestjs/common';
import { FuelSetpointsService } from '@fuel_setpoints/fuel-setpoints.service';
import { FuelSetpointsController } from '@fuel_setpoints/fuel-setpoints.controller';
import { NatsModule } from '@app/transports/nats.module';
import {UnitMeasurementService} from '@app/unit_measurement/unit_measurement.service';

@Module({
  imports:[
    NatsModule],
  exports:[FuelSetpointsService],
  controllers: [FuelSetpointsController],
  providers: [FuelSetpointsService],
})
export class FuelSetpointsModule {}
