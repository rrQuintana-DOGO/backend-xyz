import { Module } from '@nestjs/common';
import { ModulesController } from '@users/modules/modules.controller';
import { PermissionsController } from '@users/permissions/permissions.controller';
import { RolesController } from '@users/roles/roles.controller';
import { TimeZonesController } from '@users/time_zones/time_zone.controller';
import { UsersController } from '@users/users/users.controller';
import { NatsModule } from '@app/transports/nats.module';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '@app/config';
import { DataBaseManagerController } from '@users/db_manager/db_manager.controller';

@Module({
  providers: [],
  controllers: [
    ModulesController,
    PermissionsController,
    RolesController,
    TimeZonesController,
    UsersController,
    DataBaseManagerController
  ],
  imports: [
    NatsModule,
    JwtModule.register({
      secret: envs.secretKeyToken,
      signOptions: { expiresIn: '1h' },
    })
  ],
})
export class UsersModule {}
