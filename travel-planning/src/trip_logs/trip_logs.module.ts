import { Module } from '@nestjs/common';
import { NatsModule } from '@app/transports/nats.module';
import { TripLogsController } from '@trip_logs/trip_logs.controller';
import { TripLogsService } from '@trip_logs/trip_logs.service';
import { SituationsModule } from '@app/situations/situations.module';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [
    NatsModule,
    SituationsModule,
    DataBaseManagerModule,
  ],
  controllers: [TripLogsController],
  providers: [TripLogsService],
})
export class TripLogsModule {}
