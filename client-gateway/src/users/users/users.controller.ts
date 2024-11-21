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
import { CreateUserDto } from '@users/users//dto/create-user.dto';
import { UpdateUserDto } from '@users/users/dto/update-user.dto';
import { Logger } from '@nestjs/common';
import { Auth } from '@app/common/guards/auth.decorator';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(
    @Inject(NATS_SERVICE) private readonly usersClient: ClientProxy,
  ) {}

  @Post()
  @Auth()
  async createUser(@Body() createUserDto: CreateUserDto, @Request() req) {
    const data = req['data'];

    try {
      const user = await firstValueFrom(
        this.usersClient.send(
          { cmd: 'create-user' }, 
          { createUserDto, slug: data.slug }
        ),
      );

      return user;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Get()
  @Auth()
  async findAllUsers(@Query() paginationDto: PaginationDto, @Request() req) {
    const data = req['data'];
    
    try {
      const users = await firstValueFrom(
        this.usersClient.send(
          { cmd: 'find-all-users' },
          { paginationDto, slug: data.slug }
        ),
      );
      return users;
    }
    catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Get(':id')
  @Auth()
  async findOneUser(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const user = await firstValueFrom(
        this.usersClient.send(
          { cmd: 'find-one-user' }, 
          { id, slug: data.slug }
        ),
      );

      return user;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @Auth()
  async deleteUser(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const user = await firstValueFrom(
        this.usersClient.send(
          { cmd: 'remove-user' }, 
          { id, slug: data.slug }
        ),
      );

      return user;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  @Auth()
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto, 
    @Request() req
  ) {
    const data = req['data'];
      
    try {
      const user = await firstValueFrom(
        this.usersClient.send(
          { cmd: 'update-user' },
          { "updateUserDto": { id_user: id, ...updateUserDto }, slug: data.slug }
        ),
      );
      
      return user;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
