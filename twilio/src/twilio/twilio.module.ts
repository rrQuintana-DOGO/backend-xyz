import { Module } from '@nestjs/common';
import { TwilioService } from '@twilio/twilio.service';
import { TwilioController } from '@twilio/twilio.controller';

@Module({
  controllers: [TwilioController],
  providers: [TwilioService],
})
export class TwilioModule {}
