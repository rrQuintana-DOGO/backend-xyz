import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateEmailMessageDto } from '@twilio/dto/create-twilio-email.dto';
import * as sgMail from '@sendgrid/mail';
import { envs } from '@config/index';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TwilioService  {
  
  constructor() {
    sgMail.setApiKey(envs.sendgridApiKey);
  }

  private readonly logger = new Logger(TwilioService.name);

  async create(createEmailMessageDto: CreateEmailMessageDto) {

    const msg = {
      to: createEmailMessageDto.to,
      from: envs.email,
      templateId: envs.emailTemplateId,
      dynamicTemplateData: {
        subject: createEmailMessageDto.subject,
        title: createEmailMessageDto.title,
        content : createEmailMessageDto.content,
      },
    };

    try {
      await sgMail.send(msg);
      this.logger.log(`Email enviado a ${createEmailMessageDto.to}`);
      return {
        status: HttpStatus.CREATED,
        message: `Email enviado a ${createEmailMessageDto.to}`
      };
    } catch (error) {
      this.logger.error(`Erro al enviar email a ${createEmailMessageDto.to}`);
      return new RpcException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `Erro al enviar email a ${createEmailMessageDto.to}`,
        }
      )
    }
  }
}
