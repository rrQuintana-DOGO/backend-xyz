import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { PhaseService } from '@phases/phases.service';
import { CreatePhaseDto } from '@phases/dto/create-phase.dto';
import { UpdatePhaseDto } from '@phases/dto/update-phase.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';

@Controller('phases')
export class  PhasesController {
  constructor(private readonly phasesService: PhaseService) {}

  @MessagePattern({ cmd: 'create-phase' })
  create(@Payload() data: { createPhaseDto: CreatePhaseDto, slug: string }) {
    const { createPhaseDto, slug } = data;

    return this.phasesService.create(createPhaseDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-phases' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.phasesService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-phase' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.phasesService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-phase' })
  update(@Payload() data: { updatePhaseDto: UpdatePhaseDto, slug: string }) {
    const { updatePhaseDto, slug } = data;
    
    return this.phasesService.update(updatePhaseDto.id_phase, updatePhaseDto, slug);
  }

  @MessagePattern({ cmd: 'remove-phase' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.phasesService.remove(id, slug);
  }
}
