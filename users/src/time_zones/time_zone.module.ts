import { Module } from '@nestjs/common';
import { TimeZonesService } from '@timezones/time_zone.service';
import { TimeZonesController } from '@timezones/time_zone.controller';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [DataBaseManagerModule],
  exports: [TimeZonesService],
  controllers: [TimeZonesController],
  providers: [TimeZonesService],
})
export class TimeZonesModule {}
