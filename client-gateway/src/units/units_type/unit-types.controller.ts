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
  import { UpdateUnitTypeDto } from '@units/units_type/dto/update-unit-types.dto';
  import { CreateUnitTypeDto } from '@units/units_type/dto/create-unit-types.dto';
  import { Logger } from '@nestjs/common';
  import { Auth } from '@common/guards/auth.decorator';

  @Controller('unit-types')
  export class UnitTypesController {
    private readonly logger = new Logger(UnitTypesController.name);
    constructor(
      @Inject(NATS_SERVICE) private readonly clientsUnitTypes: ClientProxy,
    ) {}
  
    @Post()
    @Auth()
    async createUnitTypes(@Body() createUnitTypeDto: CreateUnitTypeDto, @Request() req) {
      const data = req['data'];

      try {
        const unit_types = await firstValueFrom(
          this.clientsUnitTypes.send(
            { cmd: 'create-unit-types' }, 
            { createUnitTypeDto, slug: data.slug }
          ),
        );

        return unit_types;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      }
    }
  
    @Get()
    @Auth()
    async findAllUnitTypes(@Query() paginationDto: PaginationDto, @Request() req) {
      const data = req['data'];

      try {
        const unit_types = await firstValueFrom(
          this.clientsUnitTypes.send(
            { cmd: 'find-all-unit-types' }, 
            { paginationDto, slug: data.slug }
          )
        );

        return unit_types
      }catch (error) {
        this.logger.error(error);
        throw new RpcException(error); 
      }
    }
  
    @Get(':id')
    @Auth()
    async findOneUnitTypes(@Param('id') id: string, @Request() req) {
      const data = req['data'];

      try {
        const unit_types = await firstValueFrom(
          this.clientsUnitTypes.send(
            { cmd: 'find-one-unit-types' }, 
            { id, slug: data.slug }
          ),
        );
  
        return unit_types;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      }
    }
  
    @Delete(':id')
    @Auth()
    async deleteUnitTypes(@Param('id') id: string, @Request() req) {
      const data = req['data'];

      try {
        const unit_types = await firstValueFrom(
          this.clientsUnitTypes.send(
            { cmd: 'remove-unit-types' }, 
            { id, slug: data.slug }
          ),
        );
  
        return unit_types;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      }
    }
  
    @Patch(':id')
    @Auth()
    async updateUnitTypes(
      @Param('id') id: string,
      @Body() updateUnitTypeDto: UpdateUnitTypeDto,
      @Request() req
    ) {
      const data = req['data'];

      try {
        const unit_types = await firstValueFrom(
          this.clientsUnitTypes.send(
            { cmd: 'update-unit-types' }, 
            { "updateUnitTypeDto": { id_unit_type: id, ...updateUnitTypeDto }, slug: data.slug }
          ),
        );

        return unit_types;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      }
    }
  }
  