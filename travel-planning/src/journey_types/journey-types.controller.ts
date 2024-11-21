import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { JorneyTypeService } from '@journey-types/journey-types.service';
import { CreateJourneyTypeDto } from '@journey-types/dto/create-journey-type.dto';
import { UpdateJourneyTypeDto } from '@journey-types/dto/update-journey-type.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';

@Controller('journey-types')
export class  JorneyTypesController {
  constructor(private readonly phasesService: JorneyTypeService) {}

  @MessagePattern({ cmd: 'create-journey-type' })
  create(@Payload() data: { createJourneyTypeDto: CreateJourneyTypeDto, slug: string }) {
    const { createJourneyTypeDto, slug } = data;

    return this.phasesService.create(createJourneyTypeDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-journey-types' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.phasesService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-journey-type' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.phasesService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-journey-type' })
  update(@Payload() data: { updateJorneyTypeDto: UpdateJourneyTypeDto, slug: string }) {
    const { updateJorneyTypeDto, slug } = data;

    return this.phasesService.update(updateJorneyTypeDto.id_journey_type, updateJorneyTypeDto, slug);
  }

  @MessagePattern({ cmd: 'remove-journey-type' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.phasesService.remove(id, slug);
  }
}
