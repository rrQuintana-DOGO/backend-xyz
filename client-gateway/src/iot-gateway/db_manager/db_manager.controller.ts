import { Controller, Inject, Post, Request } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateDatabaseDto } from '@iotGateway/db_manager/dto/create-database';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from '@config/index';
import { Auth } from '@app/common/guards/auth.decorator';


@Controller('db-iot-gateway-manager')
export class DataBaseManagerController {
  constructor(
    @Inject(NATS_SERVICE) private readonly dbManagerClient: ClientProxy,
  ) {}

  @Post()
  @Auth()
  async createNotificationsDatabase(@Request() req) {
    const data = req['data'];

    const createDatabaseDto = new CreateDatabaseDto();

    createDatabaseDto.name = data.slug;

    try {
      const database = await firstValueFrom(
        this.dbManagerClient.send({ cmd: 'create-database-notifications' }, createDatabaseDto),
      )

      return database;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
