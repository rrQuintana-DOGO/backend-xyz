import {  } from '@twilio/twilio.controller';
import { Controller } from '@nestjs/common';
import { TwilioService } from '@twilio/twilio.service';
import { CreateEmailMessageDto} from '@twilio/dto/create-twilio-email.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('twilio')
export class  TwilioController {
  constructor(private readonly twilioService: TwilioService) {}

  @MessagePattern({ cmd: 'create-email-message' })
  create(@Payload() createEmailMessageDto: CreateEmailMessageDto) {
    return this.twilioService.create(createEmailMessageDto);
  }

}
