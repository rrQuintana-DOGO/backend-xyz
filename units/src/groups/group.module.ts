import { Module } from '@nestjs/common';
import { GroupsController } from '@groups/group.controller';
import { GroupService } from '@groups/group.service';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [
    DataBaseManagerModule
  ],
  exports: [GroupService],
  controllers: [GroupsController],
  providers: [GroupService],
})
export class GroupModule {}
