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
import { UpdatePlaceDto } from '@travel-planning/places/dto/update-place.dto';
import { CreatePlaceDto } from '@travel-planning/places/dto/create-place.dto';
import { Logger } from '@nestjs/common';
import { Auth } from '@app/common/guards/auth.decorator';

@Controller('places')
export class PlacesController {
  private readonly logger = new Logger(PlacesController.name);
  constructor(
    @Inject(NATS_SERVICE) private readonly clientsTravelPlaning: ClientProxy,
  ) {}

  @Post()
  @Auth()
  async createPlace(@Body() createPlaceDto: CreatePlaceDto, @Request() req) {
    const data = req['data'];

    try {
      const place = await firstValueFrom(
        this.clientsTravelPlaning.send(
          { cmd: 'create-place' }, 
          { createPlaceDto, slug: data.slug }
        ),
      );
      return place;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);      }
  }

  @Get()
  @Auth()
  async findAllPlaces(@Query() paginationDto: PaginationDto, @Request() req) {
    const data = req['data'];
    
    try {
      const places = await firstValueFrom(
        this.clientsTravelPlaning.send(
          { cmd: 'find-all-places' }, 
          { paginationDto, slug: data.slug }
        )
      );

      return places
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);      }
  }

  @Get(':id')
  @Auth()
  async findOnePlace(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const place = await firstValueFrom(
        this.clientsTravelPlaning.send(
          { cmd: 'find-one-place' }, 
          { id, slug: data.slug }
        ),
      );

      return place;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);      }
  }

  @Delete(':id')
  @Auth()
  async deletePlace(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const place = await firstValueFrom(
        this.clientsTravelPlaning.send(
          { cmd: 'remove-place' }, 
          { id, slug: data.slug }
        ),
      );

      return place;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);      }
  }

  @Patch(':id')
  @Auth()
  async updatePlace(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
    @Request() req
  ) {
    const data = req['data'];
      
    try {
      const place = await firstValueFrom(
        this.clientsTravelPlaning.send(
          { cmd: 'update-place' }, 
          { id_place : id, ...updatePlaceDto, slug: data.slug }
        ),
      );
      
      return place;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);      }
  }
}
