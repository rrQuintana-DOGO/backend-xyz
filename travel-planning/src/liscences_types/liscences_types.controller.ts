import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LiscencesTypesService } from '@liscences_types/liscences_types.service';
import { CreateLiscencesTypeDto } from '@liscences_types/dto/create-liscences_type.dto';
import { UpdateLiscencesTypeDto } from '@liscences_types/dto/update-liscences_type.dto';
import { PaginationDto } from '@app/common';

@Controller()
export class LiscencesTypesController {
  constructor(private readonly liscencesTypesService: LiscencesTypesService) {}

  @MessagePattern({ cmd: 'create-liscences-type' })
  create(@Payload() data: { createLiscencesTypeDto: CreateLiscencesTypeDto, slug: string }) {
    const { createLiscencesTypeDto, slug } = data;

    return this.liscencesTypesService.create(createLiscencesTypeDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-liscences-types' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.liscencesTypesService.findAll(slug, paginationDto);
  }

  @MessagePattern({ cmd: 'find-one-liscences-type' })
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.liscencesTypesService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-liscences-type' })
  update(@Payload() data: { updateLiscencesTypeDto: UpdateLiscencesTypeDto, slug: string }) {
    const { updateLiscencesTypeDto, slug } = data;

    return this.liscencesTypesService.update(
      updateLiscencesTypeDto.id_license,
      updateLiscencesTypeDto,
      slug
    );
  }

  @MessagePattern({ cmd: 'remove-liscences-type' })
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.liscencesTypesService.remove(id, slug);
  }
}
