import { Module } from '@nestjs/common';
import { RoutesService } from '@routes/routes.service';
import { RoutesController } from '@routes/routes.controller';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [
    DataBaseManagerModule
  ],
  controllers: [RoutesController],
  providers: [RoutesService],
  exports: [RoutesService],
})

export class RoutesModule {}
