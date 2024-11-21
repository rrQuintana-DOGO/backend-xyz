import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { EvidenceService } from '@evidences/evidences.service';
import { CreateEvidenceDto } from '@evidences/dto/create-evidence.dto';
import { UpdateEvidenceDto } from '@evidences/dto/update-evidence.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';

@Controller('evidences')
export class  EvidencesController {
  constructor(private readonly evidencesService: EvidenceService) {}

  @MessagePattern({ cmd: 'create-evidence' })
  create(@Payload() data: { createEvidenceDto: CreateEvidenceDto, slug: string }) {
    const { createEvidenceDto, slug } = data;

    return this.evidencesService.create(createEvidenceDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-evidences' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.evidencesService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-evidence' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.evidencesService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-evidence' })
  update(@Payload() data: { updateEvidenceDto: UpdateEvidenceDto, slug: string }) {
    const { updateEvidenceDto, slug } = data;

    return this.evidencesService.update(updateEvidenceDto._id, updateEvidenceDto, slug);
  }

  @MessagePattern({ cmd: 'remove-evidence' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.evidencesService.remove(id, slug);
  }
}
