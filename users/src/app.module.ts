import { Module } from '@nestjs/common';
import { RolesModule } from '@roles/roles.module';
import { PermissionsModule } from '@permissions/permissions.module';
import { TimeZonesModule } from '@timezones/time_zone.module';
import { UsersModule } from '@users/users.module';
import { ModulesModule } from '@modules/modules.module';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [
    RolesModule,
    PermissionsModule,
    TimeZonesModule,
    UsersModule,
    ModulesModule,
    DataBaseManagerModule
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
