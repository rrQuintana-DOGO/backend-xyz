import { Module } from '@nestjs/common';
import { TwilioController } from './twilio/twilio.controller';
import { NatsModule } from '@app/transports/nats.module';

@Module({
  controllers: [TwilioController],
  providers: [],
  imports: [NatsModule]
})
export class TwilioModule {}
