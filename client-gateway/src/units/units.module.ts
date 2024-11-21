import { DeviceTypesTypesController } from '@units/devices_type/device-types.controller';
import { DevicesController } from '@units/devices/devices.controller';
import { GroupsController } from '@units/groups/groups.controller';
import { Module } from '@nestjs/common';
import { NatsModule } from '@app/transports/nats.module';
import { SetpointsController } from './setponits/setponits.controller';
import { UnitMeasurementController } from './unit_measurement/unit_measurement.controller';
import { UnitTypesController } from './units_type/unit-types.controller';
import { FuelTypesController } from './fuel_types/fuel-types.controller';
import { UnitsController } from './units/units.controller';
import { FuelSetpointsController } from './fuel_setponits/fuel-setponits.controller';
//import { UnitsController } from './units/units.controller';
import { DataBaseManagerController } from '@units/db_manager/db_manager.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '@app/config';

@Module({
  controllers: [
    DeviceTypesTypesController,
    DevicesController,
    GroupsController,
    SetpointsController,
    UnitMeasurementController,
    UnitTypesController,
    FuelTypesController,
    UnitsController,
    FuelSetpointsController,
    DataBaseManagerController
  ],
  providers: [],
  imports: [
    NatsModule,
    JwtModule.register({
      secret: envs.secretKeyToken,
      signOptions: { expiresIn: '1h' },
    })
  ],
})

export class UnitsModule {}
