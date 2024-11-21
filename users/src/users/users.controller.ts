import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { CreateUserDto } from '@users//dto/create-user.dto';
import { UpdateUserDto } from '@users//dto/update-user.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'create-user' })
  @UUIDGuard(['roles', 'permissions'])
  create(@Payload() data: { createUserDto: CreateUserDto, slug: string }) {
    const { createUserDto, slug } = data;

    return this.usersService.create(createUserDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-users' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.usersService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-user' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.usersService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-user' })
  @UUIDGuard(['roles', 'permissions'])
  update(@Payload() data: { updateUserDto: UpdateUserDto, slug: string }) {
    const { updateUserDto, slug } = data;

    return this.usersService.update(updateUserDto.id_user, updateUserDto, slug);
  }

  @MessagePattern({ cmd: 'remove-user' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.usersService.remove(id, slug);
  }
}
