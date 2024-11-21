import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { ModulesService } from '@modules/modules.service';
import { CreateModuleDto } from '@modules//dto/create-module.dto';
import { UpdateModuleDto } from '@modules//dto/update-module.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @MessagePattern({ cmd: 'create-module' })
  @UUIDGuard(['permissions'])
  create(@Payload() data: { createModuleDto: CreateModuleDto, slug: string }) {
    const { createModuleDto, slug } = data;

    return this.modulesService.create(createModuleDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-modules' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.modulesService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-module' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.modulesService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-module' })
  @UUIDGuard('permissions')
  update(@Payload() data: { updateModuleDto: UpdateModuleDto, slug: string }) {
    const { updateModuleDto, slug } = data;

    return this.modulesService.update(
      updateModuleDto.id_module,
      updateModuleDto,
      slug
    );
  }

  @MessagePattern({ cmd: 'remove-module' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.modulesService.remove(id, slug);
  }
}
