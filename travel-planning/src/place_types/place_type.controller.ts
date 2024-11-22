import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { PlacesTypesService} from '@places_types/place_type.service';
import { CreatePlaceTypeDto } from '@places_types/dto/create-place_type.dto';
import { UpdatePlaceTypeDto } from '@places_types/dto/update-place_type.dto';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';


@Controller('place-types')
export class  PlacesTypesController {
  constructor(private readonly placesTypesService: PlacesTypesService) {}

  @MessagePattern({ cmd: 'create-place-types' })
  create(@Payload() data: { createPlaceTypesDto: CreatePlaceTypeDto, slug: string }) {
    const { createPlaceTypesDto, slug } = data;

    return this.placesTypesService.create(createPlaceTypesDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-place-types' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.placesTypesService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-place-types' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.placesTypesService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-place-types' })
  update(@Payload() data: { updateUnitDto: UpdatePlaceTypeDto, slug: string }) {
    const { updateUnitDto, slug } = data;

    return this.placesTypesService.update(updateUnitDto.id_place_type, updateUnitDto, slug);
  }

  @MessagePattern({ cmd: 'remove-place-types' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.placesTypesService.remove(id, slug);
  }
}
