import { Module } from '@nestjs/common';
import { RolesService } from '@roles/roles.service';
import { RolesController } from '@roles/roles.controller';
import { PermissionsModule } from '@permissions/permissions.module';
import { DataBaseManagerModule } from '@app/db_manager/db_manager.module';

@Module({
  imports : [
    PermissionsModule,
    DataBaseManagerModule
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
