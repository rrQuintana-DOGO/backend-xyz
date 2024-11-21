import { Module } from '@nestjs/common';
import { SetpointsService } from '@setpoints/setpoints.service';
import { SetpointsController } from '@setpoints/setpoints.controller';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';
import { NatsModule } from '@app/transports/nats.module';

@Module({
  imports: [
    NatsModule,
    DataBaseManagerModule,
  ],
  controllers: [SetpointsController],
  providers: [SetpointsService],
})
export class SetpointsModule {}
