import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateLiscencesTypeDto } from './dto/create-liscences_types.dto';
import { UpdateLiscencesTypeDto } from './dto/update-liscences_types.dto';
import { Auth } from '@app/common/guards/auth.decorator';

@Controller('liscences_types')
export class LiscencesTypesController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly liscencesTypeClient: ClientProxy,
  ) {}

  @Post()
  @Auth()
  async createClient(@Body() createClientDto: CreateLiscencesTypeDto, @Request() req) {
    const data = req['data'];

    try {
      const liscenceType = await firstValueFrom(
        this.liscencesTypeClient.send(
          { cmd: 'create-liscences-type' }, 
          { createClientDto, slug: data.slug }
        ),
      );

      return liscenceType;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  async findAllLiscencesTypes(@Query() paginationDto: PaginationDto, @Request() req) {
    const data = req['data'];
    
    try {
      const liscencesTypes = await firstValueFrom(
        this.liscencesTypeClient.send(
          { cmd: 'find-all-liscences-types' }, 
          { paginationDto, slug: data.slug }
        ),
      );

      return liscencesTypes;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  async findOneClient(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const client = await firstValueFrom(
        this.liscencesTypeClient.send(
          { cmd: 'find-one-liscences-type' }, 
          { id, slug: data.slug }
        ),
      );

      return client;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  async deleteClient(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const client = await firstValueFrom(
        this.liscencesTypeClient.send(
          { cmd: 'remove-liscences-type' }, 
          { id, slug: data.slug }
        ),
      );

      return client;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async updateClient(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateLiscencesTypeDto,
    @Request() req
  ) {
    const data = req['data'];
      
    try {
      const client = await firstValueFrom(
        this.liscencesTypeClient.send('updateLiscencesType', 
          { "updateClientDto": { id_client: id, ...updateClientDto }, slug: data.slug }
        ),
      );

      return client;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
