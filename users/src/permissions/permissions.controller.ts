import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { PermissionsService } from '@permissions/permissions.service';
import { CreatePermissionDto } from '@permissions/dto/create-permission.dto';
import { UpdatePermissionDto } from '@permissions/dto/update-permission.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @MessagePattern({ cmd: 'create-permission' })
  create(@Payload() data: { createPermissionDto: CreatePermissionDto, slug: string }) {
    const { createPermissionDto, slug } = data;

    return this.permissionsService.create(createPermissionDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-permissions' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.permissionsService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-permission' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.permissionsService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-permission' })
  @UUIDGuard('id_permission')
  update(@Payload() data: { updatePermissionDto: UpdatePermissionDto, slug: string }) {
    const { updatePermissionDto, slug } = data;

    return this.permissionsService.update(
      updatePermissionDto.id_permission,
      updatePermissionDto,
      slug
    );
  }

  @MessagePattern({ cmd: 'remove-permission' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.permissionsService.remove(id, slug);
  }
}
