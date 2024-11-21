import { Module } from '@nestjs/common';
import { NatsModule } from '@app/transports/nats.module';
import { DataBaseManagerController } from '@dbManager/db_manager.controller';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Module({
  imports: [NatsModule],
  controllers: [DataBaseManagerController],
  providers: [DataBaseManagerService],
  exports: [DataBaseManagerService],
})

export class DataBaseManagerModule {}
