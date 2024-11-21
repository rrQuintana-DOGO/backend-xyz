import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { UnitTypeService } from '@units_type/unit-types.service';
import { CreateUnitTypeDto } from '@units_type/dto/create-unit-type.dto';
import { UpdateUnitTypeDto } from '@units_type/dto/update-unit-type.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';

@Controller('units_types')
export class  UnitTypesController {
  constructor(private readonly unitsTypeService: UnitTypeService) {}

  @MessagePattern({ cmd: 'create-unit-types' })
  create(@Payload() data: { createUnitTypeDto: CreateUnitTypeDto, slug: string }) {
    const { createUnitTypeDto, slug } = data;
    
    return this.unitsTypeService.create(createUnitTypeDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-unit-types' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.unitsTypeService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-unit-types' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.unitsTypeService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-unit-types' })
  update(@Payload() data: { updateUnitTypeDto: UpdateUnitTypeDto, slug: string }) {
    const { updateUnitTypeDto, slug } = data;

    return this.unitsTypeService.update(updateUnitTypeDto.id_unit_type, updateUnitTypeDto, slug);
  }

  @MessagePattern({ cmd: 'remove-unit-types' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.unitsTypeService.remove(id, slug);
  }
}
