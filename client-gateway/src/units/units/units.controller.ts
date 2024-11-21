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
    Req,
    Request,
  } from '@nestjs/common';
  import { ClientProxy, RpcException } from '@nestjs/microservices';
  import { firstValueFrom } from 'rxjs';
  import { PaginationDto } from '@common/index';
  import { NATS_SERVICE } from '@config/index';
  import { UpdateUnitDto } from '@units/units/dto/update-unit.dto';
  import { CreateUnitDto } from '@units/units/dto/create-unit.dto';
  import { Logger } from '@nestjs/common';
  import { Auth } from '@common/guards/auth.decorator';

  @Controller('units')
  export class UnitsController {
    private readonly logger = new Logger(UnitsController.name);
    constructor(
      @Inject(NATS_SERVICE) private readonly clientsUnit: ClientProxy,
    ) {}
  
    @Post()
    @Auth()
    async createUnit(@Body() createUnitDto: CreateUnitDto, @Request() req) {
      const data = req['data'];

      try {
        const unit = await firstValueFrom(
          this.clientsUnit.send(
            { cmd: 'create-unit' }, 
            { createUnitDto, slug: data.slug }
          ),
        );
  
        return unit;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      
      }
    }
  
    @Get()
    @Auth()
    async findAllUnits(@Query() paginationDto: PaginationDto, @Request() req) {
      const data = req['data'];
      
      try {

        const units = await firstValueFrom(
          this.clientsUnit.send(
            { cmd: 'find-all-units' }, 
            { paginationDto, slug: data.slug }
          )
        );

        return units;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      
      }
    }
  
    @Get(':id')
    @Auth()
    async findOneUnit(@Param('id') id: string, @Request() req) {
      const data = req['data'];
      
      try {
        const unit = await firstValueFrom(
          this.clientsUnit.send(
            { cmd: 'find-one-unit' }, 
            { id, slug: data.slug }
          ),
        );
  
        return unit;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      
      }
    }
  
    @Delete(':id')
    @Auth()
    async deleteUnit(@Param('id') id: string, @Request() req) {
      const data = req['data'];
      
      try {
        const unit = await firstValueFrom(
          this.clientsUnit.send(
            { cmd: 'remove-unit' }, 
            { id, slug: data.slug }
          ),
        );
  
        return unit;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      
      }
    }
  
    @Patch(':id')
    @Auth()
    async updateUnit(
      @Param('id') id: string,
      @Body() updateUnitDto: UpdateUnitDto,
      @Request() req
    ) {
      const data = req['data'];
      
      try {
        const unit = await firstValueFrom(
          this.clientsUnit.send(
            { cmd: 'update-unit' }, 
            { "updateUnitDto": { id_unit: id, ...updateUnitDto }, slug: data.slug }
          ),
        );
  
        return unit;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      
      }
    }
  }
  