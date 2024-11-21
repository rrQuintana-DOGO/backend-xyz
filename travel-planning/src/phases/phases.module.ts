import { DataBaseManagerModule } from '@dbManager/db_manager.module';
import { Module } from '@nestjs/common';
import { PhasesController } from '@phases/phases.controller';
import { PhaseService } from '@phases/phases.service';

@Module({
  imports: [
    DataBaseManagerModule
  ],
  controllers: [PhasesController],
  providers: [PhaseService],
  exports: [PhaseService],
})

export class PhasesModule {}
