import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TripTypesService } from './trip_types.service';
import { CreateTripTypeDto } from './dto/create-trip_type.dto';
import { UpdateTripTypeDto } from './dto/update-trip_type.dto';
import { PaginationDto } from '@app/common';
import { UUIDGuard } from '@app/common/guards/uuid-guard.decorator';

@Controller()
export class TripTypesController {
  constructor(private readonly tripTypesService: TripTypesService) {}

  @MessagePattern({ cmd: 'create-trip-type' })
  create(@Payload() data: { createTripTypeDto: CreateTripTypeDto, slug: string }) {
    const { createTripTypeDto, slug } = data;

    return this.tripTypesService.create(createTripTypeDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-trip-types' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.tripTypesService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-trip-type' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.tripTypesService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-trip-type' })
  @UUIDGuard('id')
  update(@Payload() data: { updateTripTypeDto: UpdateTripTypeDto, slug: string }) {
    const { updateTripTypeDto, slug } = data;

    return this.tripTypesService.update(
      updateTripTypeDto.id_trip_type,
      updateTripTypeDto,
      slug
    );
  }

  @MessagePattern({ cmd: 'remove-trip-type' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.tripTypesService.remove(id, slug);
  }
}
