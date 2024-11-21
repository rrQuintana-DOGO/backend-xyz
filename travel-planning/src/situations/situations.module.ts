import { Module } from '@nestjs/common';
import { NatsModule } from '@app/transports/nats.module';
import { SituationsController } from '@situations/situations.controller';
import { SituationsService } from '@situations/situations.service';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [
    NatsModule,
    DataBaseManagerModule,
  ],
  controllers: [SituationsController],
  providers: [SituationsService],
  exports: [SituationsService]
})
export class SituationsModule {}
