import { Module } from '@nestjs/common';
import { UnitTypesController } from '@units_type/unit-types.controller';
import { UnitTypeService } from '@units_type/unit-types.service';
import { NatsModule } from '@app/transports/nats.module';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports:[
    NatsModule,
    DataBaseManagerModule
  ],
  exports: [UnitTypeService],
  controllers: [UnitTypesController],
  providers: [UnitTypeService],
})

export class UnitsTypesModule {}
