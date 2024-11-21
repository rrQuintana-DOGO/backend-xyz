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
import { CreateTripTypeDto } from './dto/create-trip_type.dto';
import { NATS_SERVICE } from '@app/config';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from '@app/common';
import { UpdateTripTypeDto } from './dto/update-trip_type.dto';
import { UUIDGuard } from '@app/common/guards/uuid-guard.decorator';
import { Auth } from '@app/common/guards/auth.decorator';

@Controller('trip_types')
export class TripTypesController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly liscencesTypeClient: ClientProxy,
  ) {}

  @Post()
  @Auth()
  async createTripType(@Body() createTripTypeDto: CreateTripTypeDto, @Request() req) {
    const data = req['data'];

    try {
      const tripType = await firstValueFrom(
        this.liscencesTypeClient.send(
          { cmd: 'create-trip-type' }, 
          { createTripTypeDto, slug: data.slug }
        ),
      );

      return tripType;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  @Auth()
  async findAllTripTypes(@Query() paginationDto: PaginationDto, @Request() req) {
    const data = req['data'];
    
    try {
      const tripTypes = await firstValueFrom(
        this.liscencesTypeClient.send(
          { cmd: 'find-all-trip-types' }, 
          { paginationDto, slug: data.slug }
        ),
      );

      return tripTypes;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  @Auth()
  @UUIDGuard('id')
  async findOneTripType(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const tripType = await firstValueFrom(
        this.liscencesTypeClient.send(
          { cmd: 'find-one-trip-type' }, 
          { id, slug: data.slug }
        ),
      );

      return tripType;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  @Auth()
  @UUIDGuard('id')
  async updateTripType(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTripTypeDto: UpdateTripTypeDto,
    @Request() req
  ) {
    const data = req['data'];
      
    try {
      const tripType = await firstValueFrom(
        this.liscencesTypeClient.send(
          { cmd: 'update-trip-type' },
          { "updateTripTypeDto": { id_trip_type: id, ...updateTripTypeDto }, slug: data.slug }
        ),
      );

      return tripType;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @Auth()
  @UUIDGuard('id')
  async deleteTripType(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const tripType = await firstValueFrom(
        this.liscencesTypeClient.send(
          { cmd: 'remove-trip-type' }, 
          { id, slug: data.slug }
        ),
      );

      return tripType;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
