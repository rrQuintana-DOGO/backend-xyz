import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [RolesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
