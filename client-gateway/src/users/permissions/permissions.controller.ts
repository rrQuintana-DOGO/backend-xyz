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
  import { CreatePermissionDto } from '@users/permissions//dto/create-permission.dto';
  import { UpdatePermissionDto } from '@users/permissions/dto/update-permission.dto';
  import { Logger } from '@nestjs/common';
  import { Auth } from '@app/common/guards/auth.decorator';

  @Controller('permissions')
  export class PermissionsController {
    private readonly logger = new Logger(PermissionsController.name);
    constructor(
      @Inject(NATS_SERVICE) private readonly permissionsClient: ClientProxy,
    ) {}
  
    @Post()
    @Auth()
    async createPermission(@Body() createPermissionDto: CreatePermissionDto, @Request() req) {
      const data = req['data'];

      try {
        const permission = await firstValueFrom(
          this.permissionsClient.send(
            { cmd: 'create-permission' }, 
            { createPermissionDto, slug: data.slug }
          ),
        );
  
        return permission;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);
      }
    }
  
    @Get()
    @Auth()
    async findAllPermissions(@Query() paginationDto: PaginationDto, @Request() req) {
      const data = req['data'];
      
      try{
        const permissions = await firstValueFrom(
          this.permissionsClient.send(
            { cmd: 'find-all-permissions' }, 
            { paginationDto, slug: data.slug }
          ),
        )

        return permissions;
      }
      catch (error) {
        this.logger.error(error);
        throw new RpcException(error);
      }
    }
  
    @Get(':id')
    @Auth()
    async findOnePermission(@Param('id') id: string, @Request() req) {
      const data = req['data'];
      
      try {
        const permission = await firstValueFrom(
          this.permissionsClient.send(
            { cmd: 'find-one-permission' }, 
            { id, slug: data.slug }
          ),
        );
  
        return permission;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);    
      }
    }
  
    @Delete(':id')
    @Auth()
    async deletePermission(@Param('id') id: string, @Request() req) {
      const data = req['data'];
      
      try {
        const permission = await firstValueFrom(
          this.permissionsClient.send(
            { cmd: 'remove-permission' }, 
            { id, slug: data.slug }
          ),
        );
  
        return permission;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);    
      }
    }
  
    @Patch(':id')
    @Auth()
    async updatePermission(
      @Param('id') id: string,
      @Body() updatePermissionDto: UpdatePermissionDto, 
      @Request() req) 
    {
      const data = req['data'];
        
      try {
        const permission = await firstValueFrom(
          this.permissionsClient.send(
            { cmd: 'update-permission' }, 
            { "updatePermissionDto": { id_permission: id, ...updatePermissionDto }, slug: data.slug }
          ),
        );

        return permission;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);    
      }
    }
  }
  