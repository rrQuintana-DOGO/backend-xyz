import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateDatabaseDto } from '@app/db_manager/dto/create-database';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Controller('db-manager')
export class DataBaseManagerController {
  constructor(private readonly dataBaseManagerService: DataBaseManagerService) {}

  @MessagePattern({ cmd: 'create-database-travel-planning' })
  create(@Payload() createDatabaseTravelPlanningManagerDto: CreateDatabaseDto) {
    return this.dataBaseManagerService.create(createDatabaseTravelPlanningManagerDto);
  }
}
