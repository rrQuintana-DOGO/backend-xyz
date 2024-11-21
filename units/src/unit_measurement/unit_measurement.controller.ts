import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UnitMeasurementService } from '@unit_measurement/unit_measurement.service';
import { CreateUnitMeasurementDto } from '@unit_measurement/dto/create-unit_measurement.dto';
import { PaginationDto } from '@app/common';
import { UpdateUnitMeasurementDto } from '@unit_measurement/dto/update-unit_measurement.dto';

@Controller()
export class UnitMeasurementController {
  constructor(
    private readonly unitMeasurementService: UnitMeasurementService,
  ) {}

  @MessagePattern({ cmd: 'create-unit-measurement' })
  create(@Payload() data: { createUnitMeasurementDto: CreateUnitMeasurementDto, slug: string }) {
    const { createUnitMeasurementDto, slug } = data;

    return this.unitMeasurementService.create(createUnitMeasurementDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-unit-measurement' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.unitMeasurementService.findAll(slug, paginationDto);
  }

  @MessagePattern({ cmd: 'find-one-unit-measurement' })
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.unitMeasurementService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-unit-measurement' })
  update(@Payload() data: { updateUnitMeasurementDto: UpdateUnitMeasurementDto, slug: string }) {
    const { updateUnitMeasurementDto, slug } = data;

    return this.unitMeasurementService.update(updateUnitMeasurementDto.id_unit_measurement, updateUnitMeasurementDto, slug);
  }

  @MessagePattern({ cmd: 'remove-unit-measurement' })
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.unitMeasurementService.remove(id, slug);
  }
}
