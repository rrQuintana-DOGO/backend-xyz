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
import { CreateRoleDto } from '@users/roles//dto/create-role.dto';
import { UpdateRoleDto } from '@users/roles/dto/update-role.dto';
import { Logger } from '@nestjs/common';
import { Auth } from '@app/common/guards/auth.decorator';

@Controller('roles')
export class RolesController {
  private readonly logger = new Logger(RolesController.name);
  constructor(
    @Inject(NATS_SERVICE) private readonly rolesClient: ClientProxy,
  ) {}

  @Post()
  @Auth()
  async createRole(@Body() createRoleDto: CreateRoleDto, @Request() req) {
    const data = req['data'];

    try {
      const role = await firstValueFrom(
        this.rolesClient.send(
          { cmd: 'create-role' }, 
          { createRoleDto, slug: data.slug }
        ),
      );

      return role;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Get()
  @Auth()
  async findAllRoles(@Query() paginationDto: PaginationDto, @Request() req) {
    const data = req['data'];
    
    try {
      const roles = await firstValueFrom(
        this.rolesClient.send(
          { cmd: 'find-all-roles' }, 
          { paginationDto, slug: data.slug }
        ),
      );
      return roles;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Get(':id')
  @Auth()
  async findOneRole(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const role = await firstValueFrom(
        this.rolesClient.send(
          { cmd: 'find-one-role' }, 
          { id, slug: data.slug }
        ),
      );

      return role;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @Auth()
  async deleteRole(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const role = await firstValueFrom(
        this.rolesClient.send(
          { cmd: 'remove-role' }, 
          { id, slug: data.slug }
        ),
      );

      return role;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  @Auth()
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto, 
    @Request() req
  ) {
    const data = req['data'];
      
    try {
      const role = await firstValueFrom(
        this.rolesClient.send(
          { cmd: 'update-role' },
          { "updateRoleDto": { id_role: id, ...updateRoleDto }, slug: data.slug }
        ),
      );
      return role;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
