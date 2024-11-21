import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DataBaseManagerService } from '@dbManager/db_manager.service';
import { CreateDatabasenDto } from '@dbManager/dto/create-database';

@Controller('db-manager')
export class DataBaseManagerController {
  constructor(private readonly dataBaseManagerService: DataBaseManagerService) {}

  @MessagePattern({ cmd: 'create-database-notifications' })
  create(@Payload() createDatabasenDto: CreateDatabasenDto) {
    return this.dataBaseManagerService.create(createDatabasenDto);
  }
}
