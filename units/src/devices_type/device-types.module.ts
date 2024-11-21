import { Module } from '@nestjs/common';
import { DeviceTypesController } from '@devices_type/device-types.controller';
import { DeviceTypeService } from '@devices_type/device-types.service';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [
    DataBaseManagerModule
  ],
  exports: [DeviceTypeService],
  controllers: [DeviceTypesController],
  providers: [DeviceTypeService],
})

export class DevicesTypesModule {}
