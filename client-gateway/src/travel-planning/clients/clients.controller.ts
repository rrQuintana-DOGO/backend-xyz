import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { UpdateClientDto } from '@travel-planning/clients/dto/update-client.dto';
import { CreateClientDto } from '@travel-planning/clients/dto/create-client.dto';
import { Auth } from '@app/common/guards/auth.decorator';

@Controller('clients')
export class ClientsController {
  private readonly logger = new Logger(ClientsController.name);
  constructor(
    @Inject(NATS_SERVICE)
    private readonly clientsClient: ClientProxy,
  ) {}

  @Post()
  @Auth()
  async createClient(@Body() createClientDto: CreateClientDto, @Request() req) {
    const data = req['data'];

    try {
      const client = await firstValueFrom(
        this.clientsClient.send(
          { cmd: 'create-client' }, 
          { createClientDto, slug: data.slug }
        ),
      );

      return client;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Get()
  @Auth()
  async findAllClients(@Query() paginationDto: PaginationDto, @Request() req) {
    const data = req['data'];
    
    try {
      const clients = await firstValueFrom(
        this.clientsClient.send(
          { cmd: 'find-all-clients' }, 
          { paginationDto, slug: data.slug }
        ),
      );

      return clients;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Get(':id')
  async findOneClient(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const client = await firstValueFrom(
        this.clientsClient.send(
          { cmd: 'find-one-client' }, 
          { id, slug: data.slug }
        ),
      );

      return client;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  async deleteClient(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const client = await firstValueFrom(
        this.clientsClient.send(
          { cmd: 'remove-client' }, 
          { id, slug: data.slug }
        ),
      );

      return client;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async updateClient(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @Request() req
  ) {
    const data = req['data'];
    
    try {
      const client = await firstValueFrom(
        this.clientsClient.send(
          { cmd: 'update-client' },
          { "updateClientDto": { id_client: id, ...updateClientDto }, slug: data.slug }
        ),
      );

      return client;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
