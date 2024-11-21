import {
    Body,
    Controller,
    Inject,
    Post,
    Logger
  } from '@nestjs/common';
  import { ClientProxy, RpcException } from '@nestjs/microservices';
  import { firstValueFrom } from 'rxjs';
  import { NATS_SERVICE } from 'src/config';
  import { CreateEmailMessageDto } from '@twilio/twilio/dto/create-twilio-email.dto';

  
  @Controller('twilio')
  export class TwilioController {
    private readonly logger = new Logger(TwilioController.name);
    constructor(
      @Inject(NATS_SERVICE) private readonly clientsTwilio: ClientProxy,
    ) {}
  
    @Post('send-email')
    async createEmail(@Body() createEmailMessageDto: CreateEmailMessageDto) {
      try {
        const email = await firstValueFrom(
          this.clientsTwilio.send({ cmd: 'create-email-message' }, createEmailMessageDto),
        );
  
        return email;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);    }
    }  
}
