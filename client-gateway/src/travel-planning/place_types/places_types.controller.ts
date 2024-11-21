import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from '@common/index';
import { NATS_SERVICE } from '@config/index';
import { UpdatePlaceTypeDto } from '@travel-planning/place_types/dto/update-place_type.dto';
import { CreatePlaceTypeDto } from '@travel-planning/place_types/dto/create-place_type.dto';
import { Logger } from '@nestjs/common';
import { Auth } from '@app/common/guards/auth.decorator';

@Controller('place-types')
export class PlaceTypesController {
  private readonly logger = new Logger(PlaceTypesController.name);
  constructor(
    @Inject(NATS_SERVICE) private readonly clientsPlaceTypes: ClientProxy,
  ) {}

  @Post()
  @Auth()
  async createPlaceTypes(@Body() createPlaceTypesDto: CreatePlaceTypeDto, @Request() req) {
    const data = req['data'];

    try {
      const place_types = await firstValueFrom(
        this.clientsPlaceTypes.send(
          { cmd: 'create-place-types' }, 
          { createPlaceTypesDto, slug: data.slug }
        ),
      );

      return place_types;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);      
    }
  }

  @Get()
  @Auth()
  async findAllPlaceTypes(@Query() paginationDto: PaginationDto, @Request() req) {
    const data = req['data'];
    
    try {
      const place_types = await firstValueFrom(
        this.clientsPlaceTypes.send(
          { cmd: 'find-all-place-types' }, 
          { paginationDto, slug: data.slug }
        ),
      );

      return place_types;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error); 
    }
  }

  @Get(':id')
  @Auth()
  async findOnePlaceTypes(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const place_types = await firstValueFrom(
        this.clientsPlaceTypes.send(
          { cmd: 'find-one-place-types' }, 
          { id, slug: data.slug }
        ),
      );

      return place_types;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);      
    }
  }

  @Delete(':id')
  @Auth()
  async deletePlaceTypes(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const place_types = await firstValueFrom(
        this.clientsPlaceTypes.send(
          { cmd: 'remove-place-types' }, 
          { id, slug: data.slug }
        ),
      );

      return place_types;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);      
    }
  }

  @Patch(':id')
  @Auth()
  async updatePlaceTypes(
    @Param('id') id: string,
    @Body() updatePlaceTypesDto: UpdatePlaceTypeDto,
    @Request() req
  ) {
    const data = req['data'];

    try {
      const place_types = await firstValueFrom(
        this.clientsPlaceTypes.send(
          { cmd: 'update-place-types' }, 
          { "updatePlaceTypesDto": { id_place_type: id, ...updatePlaceTypesDto }, slug: data.slug }
        ),
      );

      return place_types;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);      
    }
  }
}