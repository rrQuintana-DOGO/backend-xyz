import { Module } from '@nestjs/common';
import { EventsTripsService } from './events-trips.service';
import { EventsTripsController } from './events-trips.controller';

@Module({
  controllers: [EventsTripsController],
  providers: [EventsTripsService],
})
export class EventsTripsModule {}
