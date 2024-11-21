import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { RolesService } from '@roles/roles.service';
import { CreateRoleDto } from '@roles//dto/create-role.dto';
import { UpdateRoleDto } from '@roles//dto/update-role.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @MessagePattern({ cmd: 'create-role' })
  @UUIDGuard('permissions')
  create(@Payload() data: { createRoleDto: CreateRoleDto, slug: string }) {
    const { createRoleDto, slug } = data;

    return this.rolesService.create(createRoleDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-roles' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.rolesService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-role' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.rolesService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-role' })
  @UUIDGuard('permissions')
  update(@Payload() data: { updateRoleDto: UpdateRoleDto, slug: string }) {
    const { updateRoleDto, slug } = data;

    return this.rolesService.update(updateRoleDto.id_role, updateRoleDto, slug);
  }

  @MessagePattern({ cmd: 'remove-role' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.rolesService.remove(id, slug);
  }
}
