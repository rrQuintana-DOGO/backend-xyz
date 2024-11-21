import { forwardRef, Module } from '@nestjs/common';
import { UnitsController } from '@units/units.controller';
import { UnitsService } from '@units/units.service';
import {DevicesModule } from '@devices/devices.module';
import {UnitsTypesModule } from '@units_type/unit-types.module';
import {FuelTypesModule } from '@fuel_types/fuel-types.module';
import { NatsModule } from '@app/transports/nats.module';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';
@Module({
  imports: [
    forwardRef(()=>DevicesModule),
    UnitsTypesModule,
    FuelTypesModule,
    NatsModule,
    DataBaseManagerModule
  ],
  controllers: [UnitsController],
  providers: [UnitsService],
  exports: [UnitsService],
})
export class UnitsModule {}
