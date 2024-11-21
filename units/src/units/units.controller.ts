import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { UnitsService } from '@units/units.service';
import { CreateUnitDto } from '@units/dto/create-unit.dto';
import { UpdateUnitDto } from '@units/dto/update-unit.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';
import { IdsDto } from '@units/dto/ids.dto';


@Controller('units')
export class  UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @MessagePattern({ cmd: 'create-unit' })
  @UUIDGuard('id_unit_type')
  @UUIDGuard('id_fuel_type')
  @UUIDGuard('devices')
  create(@Payload() data: { createUnitDto: CreateUnitDto, slug: string }) {
    const { createUnitDto, slug } = data;

    return this.unitsService.create(createUnitDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-units' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.unitsService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-unit' })
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.unitsService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'validate-units' })
  validateEvents(@Payload() idsDto: IdsDto,) {

    return this.unitsService.validateUnitsExist(idsDto.units, idsDto.property, idsDto.slug); 
  }

  @MessagePattern({ cmd: 'update-unit' })
  @UUIDGuard('id_unit_type')
  @UUIDGuard('id_fuel_type')
  @UUIDGuard('devices')

  update(@Payload() data: { updateUnitDto: UpdateUnitDto, slug: string }) {
    const { updateUnitDto, slug } = data;

    return this.unitsService.update(updateUnitDto.id_unit, updateUnitDto, slug);
  }

  @MessagePattern({ cmd: 'remove-unit' })
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.unitsService.remove(id, slug);
  }

  @MessagePattern({ cmd: 'find-units-by-ids' })
  findUnitsByIds(@Payload('units') units: Array<string>, @Payload('slug') slug: string) {
    return this.unitsService.findUnitsByIds(units, slug);
  }
}
