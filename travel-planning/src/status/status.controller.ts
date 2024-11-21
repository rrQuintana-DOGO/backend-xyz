import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { StatusService } from '@status/status.service';
import { CreateStatusDto } from '@status/dto/create-status.dto';
import { UpdateStatusDto } from '@status/dto/update-status.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';

@Controller('status')
export class  StatusController {
  constructor(private readonly statusService: StatusService) {}

  @MessagePattern({ cmd: 'create-status' })
  create(@Payload() data: { createStatusDto: CreateStatusDto, slug: string }) {
    const { createStatusDto, slug } = data;

    return this.statusService.create(createStatusDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-status' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.statusService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-status' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.statusService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-status' })
  update(@Payload() data: { updateStatusDto: UpdateStatusDto, slug: string }) {
    const { updateStatusDto, slug } = data;

    return this.statusService.update(updateStatusDto.id_status, updateStatusDto, slug);
  }

  @MessagePattern({ cmd: 'remove-status' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.statusService.remove(id, slug);
  }
}
