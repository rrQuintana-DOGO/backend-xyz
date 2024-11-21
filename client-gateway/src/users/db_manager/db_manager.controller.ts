import { Controller, Inject, Post, Request } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateDatabaseDto } from '@units/db_manager/dto/create-database';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from '@config/index';
import { Auth } from '@app/common/guards/auth.decorator';


@Controller('db-users-manager')
export class DataBaseManagerController {
  constructor(
    @Inject(NATS_SERVICE) private readonly dbManagerClient: ClientProxy,
  ) {}

  @Post()
  @Auth()
  async createUsersDatabase(@Request() req) {
    const data = req['data'];

    const createDatabaseDto = new CreateDatabaseDto();

    createDatabaseDto.name = data.slug;

    try {
      const database = await firstValueFrom(
        this.dbManagerClient.send({ cmd: 'create-database-users' }, createDatabaseDto),
      )

      return database;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
