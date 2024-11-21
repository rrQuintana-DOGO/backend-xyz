import { Controller, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { FuelTypeService } from '@fuel_types/fuel-types.service';
import { CreateFuelTypeDto } from '@fuel_types/dto/create-fuel-type.dto';
import { UpdateFuelTypeDto } from '@fuel_types/dto/update-fuel-type.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';

@Controller('fuel_types')
export class  FuelTypesController {
  constructor(private readonly fuelTypeService: FuelTypeService) {}

  @MessagePattern({ cmd: 'create-fuel-types' })
  create(@Payload() data: { createFuelTypeDto: CreateFuelTypeDto, slug: string }) {
    const { createFuelTypeDto, slug } = data;

    return this.fuelTypeService.create(createFuelTypeDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-fuel-types' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.fuelTypeService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-fuel-types' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.fuelTypeService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-fuel-types' })
  update(@Payload() data: { updateFuelTypeDto: UpdateFuelTypeDto, slug: string }) {
    const { updateFuelTypeDto, slug } = data;

    return this.fuelTypeService.update(updateFuelTypeDto.id_fuel_type, updateFuelTypeDto, slug);
  }

  @MessagePattern({ cmd: 'remove-fuel-types' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.fuelTypeService.remove(id, slug);
  }
}
