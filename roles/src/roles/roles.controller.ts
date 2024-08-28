import { Controller, ParseIntPipe } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @MessagePattern({ cmd: 'create-role' })
  create(@Payload() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @MessagePattern({ cmd: 'find-all-roles' })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.rolesService.findAll(paginationDto);
  }

  @MessagePattern({ cmd: 'find-one-role' })
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @MessagePattern({ cmd: 'update-role' })
  update(@Payload() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(updateRoleDto.id, updateRoleDto);
  }

  @MessagePattern({ cmd: 'remove-role' })
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(+id);
  }
}
