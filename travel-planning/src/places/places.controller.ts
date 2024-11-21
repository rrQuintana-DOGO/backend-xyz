import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from '@places/dto/create-place.dto';
import { UpdatePlaceDto } from '@places/dto/update-place.dto';
import { PaginationDto } from '@common/index';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';
import { IdsDto } from './dto/ids.dto';


@Controller('places')
export class  PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @MessagePattern({ cmd: 'create-place' })
  @UUIDGuard('id_place')
  @UUIDGuard('id_geofence')
  create(@Payload() data: { createPlaceDto: CreatePlaceDto, slug: string }) {
    const { createPlaceDto, slug } = data;

    return this.placesService.create(createPlaceDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-places' })
  findAll(@Payload() data: { paginationDto: PaginationDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.placesService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-place' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.placesService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'validate-places' })
  validateEvents(@Payload() data: { idsDto: IdsDto, slug: string }) {
    const { idsDto, slug } = data;

    return this.placesService.validatePlacesExist(idsDto.places, idsDto.property, slug);
  }

  @MessagePattern({ cmd: 'update-place' })
  @UUIDGuard('id_place')
  @UUIDGuard('id_geofence')
  @UUIDGuard('contacts')
  update(@Payload() data: { updatePlaceDto: UpdatePlaceDto, slug: string }) {
    const { updatePlaceDto, slug } = data;

    return this.placesService.update(updatePlaceDto.id_place, updatePlaceDto, slug);
  }

  @MessagePattern({ cmd: 'remove-place' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.placesService.remove(id, slug);
  }

}
