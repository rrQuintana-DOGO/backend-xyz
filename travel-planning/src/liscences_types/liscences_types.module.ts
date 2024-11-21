import { Module } from '@nestjs/common';
import { LiscencesTypesService } from '@liscences_types/liscences_types.service';
import { LiscencesTypesController } from '@liscences_types/liscences_types.controller';
import { DataBaseManagerModule } from '@dbManager/db_manager.module';

@Module({
  imports: [
    DataBaseManagerModule
  ],
  controllers: [LiscencesTypesController],
  providers: [LiscencesTypesService],
})

export class LiscencesTypesModule {}
