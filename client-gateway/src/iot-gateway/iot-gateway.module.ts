import { Module } from '@nestjs/common';
import { NatsModule } from '@app/transports/nats.module';
import { DataBaseManagerController } from '@iotGateway/db_manager/db_manager.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '@app/config';
import { TelemetryController } from '@iotGateway/telemetry/telemetry.controller';

@Module({
  controllers: [DataBaseManagerController, TelemetryController],
  providers: [],
  imports: [
    NatsModule,
    JwtModule.register({
      secret: envs.secretKeyToken,
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class IoTGatewayModule {}
