import { Module } from '@nestjs/common';
import { FuelTypesController } from '@fuel_types/fuel-types.controller';
import { FuelTypeService } from '@fuel_types/fuel-types.service';
import { NatsModule } from '@app/transports/nats.module';
import { DataBaseManagerModule } from '@app/db_manager/db_manager.module';

@Module({
  imports:[
    NatsModule,
    DataBaseManagerModule
  ],
  exports: [FuelTypeService],
  controllers: [FuelTypesController],
  providers: [FuelTypeService],
})

export class FuelTypesModule {}
