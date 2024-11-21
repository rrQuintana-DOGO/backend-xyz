import { Module } from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { UsersController } from '@users/users.controller';
import { RolesModule } from '@roles/roles.module';
import { PermissionsModule } from '@permissions/permissions.module';
import { TimeZonesModule } from '@timezones/time_zone.module';
import { DataBaseManagerModule } from '@app/db_manager/db_manager.module';

@Module({
  imports: [ 
    RolesModule, 
    PermissionsModule, 
    TimeZonesModule,
    DataBaseManagerModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
})

export class UsersModule {}
