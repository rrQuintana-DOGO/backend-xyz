import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { Logger } from '@nestjs/common';
import { envs } from '@config/index';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CustomValidationPipe } from '@common/exceptions/custom-validation-pipe';

async function bootstrap() {
  const logger = new Logger('Main-Travel-Planning');
  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers : envs.natsServers,
      },
    },
  );
  app.useGlobalPipes(
    new CustomValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen();
  logger.log(`Travel planning microservice running on port`);
}
bootstrap();