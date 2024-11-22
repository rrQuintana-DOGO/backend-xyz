import { Module } from '@nestjs/common';
import { EventsTripsModule } from './events-trips/events-trips.module';

@Module({
  imports: [EventsTripsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
