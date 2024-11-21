import { Module } from '@nestjs/common';
import { ModulesService } from '@modules/modules.service';
import { ModulesController } from '@modules/modules.controller';
import { PermissionsModule } from '@permissions/permissions.module';
import { DataBaseManagerModule } from '@app/db_manager/db_manager.module';

@Module({
  imports : [
    PermissionsModule,
    DataBaseManagerModule
  ],
  controllers: [ModulesController],
  providers: [ModulesService],
})

export class ModulesModule {}
