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
  import { UpdateFuelTypeDto } from '@units/fuel_types/dto/update-fuel-types.dto';
  import { CreateFuelTypeDto } from '@units/fuel_types/dto/create-fuel-types.dto';
  import { Logger } from '@nestjs/common';
  import { Auth } from '@app/common/guards/auth.decorator';

  @Controller('fuel-types')
  export class FuelTypesController {
    private readonly logger = new Logger(FuelTypesController.name);
    constructor(
      @Inject(NATS_SERVICE) private readonly clientsFuelTypes: ClientProxy,
    ) {}
  
    @Post()
    @Auth()
    async createFuelTypes(@Body() createFuelTypeDto: CreateFuelTypeDto, @Request() req) {
      const data = req['data'];

      try {
        const fuel_types = await firstValueFrom(
          this.clientsFuelTypes.send(
            { cmd: 'create-fuel-types' }, 
            { createFuelTypeDto, slug: data.slug }
          ),
        );
        return fuel_types;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      }
    }
  
    @Get()
    @Auth()
    async findAllFuelTypes(@Query() paginationDto: PaginationDto, @Request() req) {
      const data = req['data'];

      try {
        const fuel_types = await firstValueFrom(
          this.clientsFuelTypes.send(
            { cmd: 'find-all-fuel-types' }, 
            { paginationDto, slug: data.slug },
          )
        );
        return fuel_types
      }catch (error) {
        this.logger.error(error);
        throw new RpcException(error); 
      }
    }
  
    @Get(':id')
    @Auth()
    async findOneFuelTypes(@Param('id') id: string, @Request() req) {
      const data = req['data'];

      try {
        const fuel_types = await firstValueFrom(
          this.clientsFuelTypes.send(
            { cmd: 'find-one-fuel-types' }, 
            { id, slug: data.slug }
          ),
        );
  
        return fuel_types;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      }
    }
  
    @Delete(':id')
    @Auth()
    async deleteFuelTypes(@Param('id') id: string, @Request() req) {
      const data = req['data'];

      try {
        const fuel_types = await firstValueFrom(
          this.clientsFuelTypes.send(
            { cmd: 'remove-fuel-types' }, 
            { id, slug: data.slug }
          ),
        );
  
        return fuel_types;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      }
    }
  
    @Patch(':id')
    @Auth()
    async updateFuelTypes(
      @Param('id') id: string,
      @Body() updateFuelTypeDto: UpdateFuelTypeDto,
      @Request() req
    ) {
      const data = req['data'];

      try {
        const fuel_types = await firstValueFrom(
          this.clientsFuelTypes.send(
            { cmd: 'update-fuel-types' }, 
            { "updateFuelTypeDto": { id_fuel_type : id, ...updateFuelTypeDto }, slug: data.slug }
          ),
        );
        return fuel_types;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      }
    }
  }
  