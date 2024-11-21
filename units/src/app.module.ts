import { Module } from '@nestjs/common';
import { DevicesModule } from '@devices/devices.module';
import { DevicesTypesModule } from '@devices_type/device-types.module';
import { GroupModule } from '@groups/group.module';
import { UnitsModule } from '@units/units.module';
import { UnitMeasurementModule } from '@unit_measurement/unit_measurement.module';
import { SetpointsModule } from '@setpoints/setpoints.module';
import { UnitsTypesModule } from '@units_type/unit-types.module';
import { FuelTypesModule } from '@fuel_types/fuel-types.module';
import { FuelSetpointsModule } from '@fuel_setpoints/fuel-setpoints.module';
import { DataBaseManagerModule } from './db_manager/db_manager.module';

@Module({
  imports: [
    DevicesModule, 
    DevicesTypesModule,
    GroupModule, 
    UnitsModule,
    UnitMeasurementModule,
    SetpointsModule,
    UnitsTypesModule,
    FuelTypesModule,
    FuelSetpointsModule,
    DataBaseManagerModule
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
