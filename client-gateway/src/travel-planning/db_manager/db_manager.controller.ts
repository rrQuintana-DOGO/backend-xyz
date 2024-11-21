import { Controller, Inject, Post, Request } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from '@config/index';
import { Auth } from '@app/common/guards/auth.decorator';
import { CreateDatabaseTravelPlanningManagerDto } from '@travel-planning/db_manager/dto/create-database-travel-planning-manager';


@Controller('db-travel-planning-manager')
export class DataBaseTravelPlanningManagerController {
  constructor(
    @Inject(NATS_SERVICE) private readonly dbManagerClient: ClientProxy,
  ) {}

  @Post()
  @Auth()
  async createDatabase(@Request() req) {
    const data = req['data'];

    const createDatabaseTravelPlanningManagerDto = new CreateDatabaseTravelPlanningManagerDto();

    createDatabaseTravelPlanningManagerDto.name = data.slug;

    try {
      const database = await firstValueFrom(
        this.dbManagerClient.send({ cmd: 'create-database-travel-planning' }, createDatabaseTravelPlanningManagerDto),
      )

      return database;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
