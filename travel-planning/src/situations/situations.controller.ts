import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';
import { CreateSituationDto } from '@situations/dto/create-situation.dto';
import { SituationsService } from '@situations/situations.service';
import { UpdateSituationDto } from '@situations/dto/update-situations.dto';

@Controller('situations')
export class  SituationsController {
  constructor(private readonly situationsService: SituationsService) {}

  @MessagePattern({ cmd: 'create-situation' })
  create(@Payload() data:{ createSituationDto: CreateSituationDto, slug }) {
    const { createSituationDto, slug } = data;

    return this.situationsService.create(createSituationDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-situations' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug }) {
    const { paginationDto, slug } = data;

    return this.situationsService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-situation' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.situationsService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-situation' })
  update(@Payload() data: { updateSituationDto: UpdateSituationDto, slug }) {
    const { updateSituationDto, slug } = data;

    return this.situationsService.update(updateSituationDto.id_situation, updateSituationDto, slug);
  }

  @MessagePattern({ cmd: 'remove-situation' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.situationsService.remove(id, slug);
  }
}