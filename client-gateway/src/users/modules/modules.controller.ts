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
    Logger,
    Request,
  } from '@nestjs/common';
  import { ClientProxy, RpcException } from '@nestjs/microservices';
  import { firstValueFrom } from 'rxjs';
  import { PaginationDto } from '@common/index';
  import { NATS_SERVICE } from '@config/index';
  import { CreateModuleDto } from '@users/modules/dto/create-module.dto';
  import { UpdateModuleDto } from '@users/modules/dto/update-module.dto';
  import { Auth } from '@app/common/guards/auth.decorator';
  
  @Controller('modules')
  export class ModulesController {
    private readonly logger = new Logger(ModulesController.name);
    constructor(
      @Inject(NATS_SERVICE) private readonly modulesClient: ClientProxy,
    ) {}
  
    @Post()
    @Auth()
    async createModule(@Body() createModuleDto: CreateModuleDto, @Request() req) {
      const data = req['data'];

      try {
        const module = await firstValueFrom(
          this.modulesClient.send(
            { cmd: 'create-module' }, 
            { createModuleDto, slug: data.slug }
          ),
        );
  
        return module;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);
      }
    }
  
    @Get()
    @Auth()
    async findAllModules(@Query() paginationDto: PaginationDto, @Request() req) {
      const data = req['data'];
      
      try {
        const modules = await firstValueFrom(
          this.modulesClient.send(
            { cmd: 'find-all-modules' }, 
            { paginationDto, slug: data.slug }
          ),
        );
        return modules;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);
      }
    }
  
    @Get(':id')
    @Auth()
    async findOneModule(@Param('id') id: string, @Request() req) {
      const data = req['data'];
      
      try {
        const module = await firstValueFrom(
          this.modulesClient.send(
            { cmd: 'find-one-module' }, 
            { id, slug: data.slug }
          ),
        );
  
        return module;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);    }
    }
  
    @Delete(':id')
    @Auth()
    async deleteModule(@Param('id') id: string, @Request() req) {
      const data = req['data'];
      
      try {
        const module = await firstValueFrom(
          this.modulesClient.send(
            { cmd: 'remove-module' }, 
            { id, slug: data.slug }
          ),
        );
  
        return module;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);    }
    }
  
    @Patch(':id')
    @Auth()
    async updateModule(
      @Param('id') id: string,
      @Body() updateModuleDto: UpdateModuleDto,
      @Request() req
    ) {
      const data = req['data'];
      
      try {
        const module = await firstValueFrom(
          this.modulesClient.send(
            { cmd: 'update-module' }, 
            { "updateModuleDto": { id_module: id, ...updateModuleDto }, slug: data.slug }
          ),
        );
        return module;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);    }
    }
  }
  