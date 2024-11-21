import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { GroupService } from '@groups/group.service';
import { CreateGroupDto } from '@groups/dto/create-group.dto';
import { UpdateGroupDto } from '@groups/dto/update-group.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';

@Controller('groups')
export class  GroupsController {
  constructor(private readonly groupsService: GroupService) {}

  @MessagePattern({ cmd: 'create-group' })
  create(@Payload() data: { createGroupDto: CreateGroupDto, slug: string }) {
    const { createGroupDto, slug } = data;
    return this.groupsService.create(createGroupDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-groups' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.groupsService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-group' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.groupsService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-group' })
  @UUIDGuard('id_group')
  update(@Payload() data: { updateGroupDto: UpdateGroupDto, slug: string }) {
    const { updateGroupDto, slug } = data;

    return this.groupsService.update(updateGroupDto.id_group, updateGroupDto, slug);
  }

  @MessagePattern({ cmd: 'remove-group' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.groupsService.remove(id, slug);
  }
}
