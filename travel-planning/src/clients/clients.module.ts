import { Module } from '@nestjs/common';
import { ClientService } from '@clients/clients.service';
import { ClientsController } from '@clients/clients.controller';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [
    DataBaseManagerModule
  ],
  controllers: [ClientsController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientsModule {}
