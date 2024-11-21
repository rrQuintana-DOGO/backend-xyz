import { NATS_SERVICE } from '@app/config';
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
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { PaginationDto } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { UpdateCarrierDto } from './dto/update-carrier.dto';
import { Auth } from '@app/common/guards/auth.decorator';

@Controller('carriers')
export class CarriersController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly carriersClient: ClientProxy,
  ) {}

  @Post()
  @Auth()
  async createCarrier(@Body() createCarrierDto: CreateCarrierDto, @Request() req) {
    const data = req['data'];

    try {
      const carrier = await firstValueFrom(
        this.carriersClient.send(
          { cmd: 'create-carrier' }, 
          { createCarrierDto, slug: data.slug }
        ),
      );

      return carrier;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  @Auth()
  async findAllCarriers(@Query() paginationDto: PaginationDto, @Request() req) {
    const data = req['data'];
    
    try {
      const carriers = await firstValueFrom(
        this.carriersClient.send(
          { cmd: 'find-all-carriers' }, 
          { paginationDto, slug: data.slug }
        ),
      );

      return carriers;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  @Auth()
  async findOneCarrier(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const carrier = await firstValueFrom(
        this.carriersClient.send(
          { cmd: 'find-one-carrier' }, 
          { id, slug: data.slug }
        ),
      );

      return carrier;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  @Auth()
  async updateCarrier(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCarrierDto: UpdateCarrierDto,
    @Request() req
  ) {
    const data = req['data'];

    try {
      const carrier = await firstValueFrom(
        this.carriersClient.send(
          { cmd: 'update-carrier' },
          { "updateCarrierDto": { id_carrier: id, ...updateCarrierDto }, slug: data.slug }
        ),
      );

      return carrier;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @Auth()
  async deleteCarrier(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const carrier = await firstValueFrom(
        this.carriersClient.send('removeCarrier', { id }),
      );

      return carrier;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
