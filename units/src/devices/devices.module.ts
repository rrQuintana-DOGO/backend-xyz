import { Module } from '@nestjs/common';
import { DevicesController } from '@devices/devices.controller';
import { DeviceService } from '@devices/devices.service';
import { GroupModule } from '@groups/group.module';
import { DevicesTypesModule } from '@devices_type/device-types.module';
import { UnitsModule } from '@units/units.module';
import { NatsModule } from '@app/transports/nats.module';
import { DataBaseManagerModule } from '@app/db_manager/db_manager.module';

@Module({
  imports: [
    GroupModule, 
    DevicesTypesModule,
    UnitsModule,
    DataBaseManagerModule,
    NatsModule
  ],
  exports: [DeviceService],
  controllers: [DevicesController],
  providers: [DeviceService],
})
export class DevicesModule {}
