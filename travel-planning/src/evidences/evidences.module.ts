import { Module } from '@nestjs/common';
import { EvidenceService } from '@evidences/evidences.service';
import { EvidencesController } from '@evidences/evidences.controller';
import { StorageModule } from '@storage/storage.module';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  controllers: [EvidencesController],
  providers: [EvidenceService],
  exports: [EvidenceService],
  imports: [
    StorageModule,
    DataBaseManagerModule
  ],
})

export class EvidencesModule {}
