import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';
import { TripLogsService } from '@trip_logs/trip_logs.service';
import { CreateTripLogDto } from './dto/create-trip_logs.dto';
import { PaginationDto } from '@app/common';


@Controller('trips_logs')
export class TripLogsController {
  constructor(private readonly tripLogsService: TripLogsService) { }

  @MessagePattern({ cmd: 'create-trip-log' })
  create(@Payload() data: { createTripLogDto: CreateTripLogDto, slug: string }) {
    const { createTripLogDto, slug } = data;

    return this.tripLogsService.create(createTripLogDto, slug);
  }

  @MessagePattern({ cmd: 'find-logs-by-id' })
  @UUIDGuard('id')
  findLogsById(@Payload() payload: { id: string, slug: string, paginationDto: PaginationDto }) {
    const { id, slug, paginationDto } = payload;
    return this.tripLogsService.findLogsById(id, slug, paginationDto);
  }

  @MessagePattern({ cmd: 'find-one-trip-log' })
  @UUIDGuard('id')
  findOne(@Payload('id', ParseUUIDPipe) id: string, @Payload('slug') slug: string) {
    return this.tripLogsService.findOne(id, slug);
  }

  @MessagePattern({ cmd: 'find-all-trips-completed' })
  findAllTripsCompleted(@Payload('slug') slug: string) {
    return this.tripLogsService.findFinishedTrips(slug);
  }
}
