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
  import { UpdateGroupDto } from '@units/groups/dto/update-group.dto';
  import { CreateGroupDto } from '@units/groups/dto/create-group.dto';
  import { Logger } from '@nestjs/common';
  import { Auth } from '@app/common/guards/auth.decorator';

  @Controller('groups')
  export class GroupsController {
    private readonly logger = new Logger(GroupsController.name);
    constructor(
      @Inject(NATS_SERVICE) private readonly clientsGroup: ClientProxy,
    ) {}
  
    @Post()
    @Auth()
    async createGroup(@Body() createGroupDto: CreateGroupDto, @Request() req) {
      const data = req['data'];

      try {
        const group = await firstValueFrom(
          this.clientsGroup.send(
            { cmd: 'create-group' },
            { createGroupDto, slug: data.slug },
          ),
        );
  
        return group;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      }
    }
  
    @Get()
    @Auth()
    async findAllGroups(@Query() paginationDto: PaginationDto, @Request() req) {
      const data = req['data'];

      try {
        const groups = await firstValueFrom(
          this.clientsGroup.send(
            { cmd: 'find-all-groups' }, 
            { paginationDto, slug: data.slug },
          ),
        );
  
        return groups;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      }
    }
  
    @Get(':id')
    @Auth()
    async findOneGroup(@Param('id') id: string, @Request() req) {
      const data = req['data'];

      try {
        const group = await firstValueFrom(
          this.clientsGroup.send(
            { cmd: 'find-one-group' }, 
            { id, slug: data.slug },
          ),
        );
  
        return group;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      }
    }
  
    @Delete(':id')
    @Auth()
    async deleteGroup(@Param('id') id: string, @Request() req) {
      const data = req['data'];

      try {
        const group = await firstValueFrom(
          this.clientsGroup.send(
            { cmd: 'remove-group' }, 
            { id, slug: data.slug },
          ),
        );
  
        return group;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      }
    }
  
    @Patch(':id')
    @Auth()
    async updateGroup(
      @Param('id') id: string,
      @Body() updateGroupDto: UpdateGroupDto,
      @Request() req,
    ) {
      const data = req['data'];

      try {
        const group = await firstValueFrom(
          this.clientsGroup.send(
            { cmd: 'update-group' }, 
            { "updateGroupDto": { id_group : id, ...updateGroupDto }, slug: data.slug },
          ),
        );
  
        return group;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);      }
    }
  }
  