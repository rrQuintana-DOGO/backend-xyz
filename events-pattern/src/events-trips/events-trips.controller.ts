import { Controller, Logger } from '@nestjs/common';
import { EventsTripsService } from '@eventsTrips/events-trips.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('events-trips')
export class EventsTripsController {
  constructor(private readonly eventsTripsService: EventsTripsService) { }

  @EventPattern('mqtt-data-processed')
  handleMqttDataProcessed(@Payload() data: any) {
    return this.eventsTripsService.sendTelemetry(data);
  }

}
