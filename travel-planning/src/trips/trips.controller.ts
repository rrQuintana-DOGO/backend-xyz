import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { TripsService } from '@trips/trips.service';
import { CreateTripDto } from '@trips/dto/create-trip.dto';
import { UpdateTripDto } from '@trips/dto/update-trip.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';
import { PaginationTripDto } from '@trips/dto/pagination-trip.dto';
import { ExcelTripDataDto } from '@trips/dto/excel-trip-data.dto';
import { CalculateEtaDto } from '@trips/dto/calculate-eta.dto';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) { }

  @MessagePattern({ cmd: 'create-trip' })
  @UUIDGuard(['events', 'drivers'])
  create(@Payload() data: { createTripDto: CreateTripDto, slug: string }) {
    const { createTripDto, slug } = data;

    return this.tripsService.create(createTripDto, slug);
  }

  @MessagePattern({ cmd: 'find-all-trips' })
  findAll(@Payload() data: { paginationDto: PaginationTripDto, slug: string }) {
    const { paginationDto, slug } = data;

    return this.tripsService.findAll(paginationDto, slug);
  }

  @MessagePattern({ cmd: 'find-one-trip' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.tripsService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'update-trip' })
  @UUIDGuard(['events', 'drivers'])
  update(@Payload() data: { updateTripDto: UpdateTripDto, slug: string }) {
    const { updateTripDto, slug } = data;

    return this.tripsService.update(updateTripDto.id_trip, updateTripDto, slug);
  }

  @MessagePattern({ cmd: 'import-trips' })
  import(@Payload() dataInfo: { data: Array<ExcelTripDataDto>, slug : string }) {
    const { data, slug } = dataInfo;
    return this.tripsService.importData(data, slug);
  }

  @MessagePattern({ cmd: 'remove-trip' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.tripsService.remove(id, slug);
  }

  @MessagePattern({ cmd: 'find-trips-by-ids' })
  @UUIDGuard('trips')
  findTripsByIds(@Payload('trips') trips: Array<string>, @Payload('slug') slug: string) {
    return this.tripsService.findTripsByIds(trips, slug);
  }

  @MessagePattern({ cmd: 'calculate-trips-eta' })
  async calculateTripEta(@Payload() data: { calculateEtaDto: CalculateEtaDto, slug: string }) {
    const { calculateEtaDto, slug } = data;

    const eta = await this.tripsService.calculateEta(calculateEtaDto, slug);
    return eta;
  }
}
