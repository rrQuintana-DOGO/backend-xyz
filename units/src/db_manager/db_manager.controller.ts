import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateDatabaseDto } from '@dbManager/dto/create-database';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Controller('db-manager')
export class DataBaseManagerController {
  constructor(private readonly dataBaseManagerService: DataBaseManagerService) {}

  @MessagePattern({ cmd: 'create-database-units' })
  create(@Payload() createDatabaseDto: CreateDatabaseDto) {
    return this.dataBaseManagerService.create(createDatabaseDto);
  }
}
