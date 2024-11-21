import { Module } from '@nestjs/common';
import { ContactService } from '@contacts/contacts.service';
import { ContactsController } from '@contacts/contacts.controller';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [
    DataBaseManagerModule
  ],
  controllers: [ContactsController],
  providers: [ContactService],
})
export class ContactsModule {}
