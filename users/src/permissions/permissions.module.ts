import { Module } from '@nestjs/common';
import { PermissionsService } from '@permissions/permissions.service';
import { PermissionsController } from '@permissions/permissions.controller';
import { DataBaseManagerModule } from '@app/db_manager/db_manager.module';

@Module({
  imports: [
    DataBaseManagerModule
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})

export class PermissionsModule {}
