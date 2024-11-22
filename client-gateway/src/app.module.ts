import { Module } from '@nestjs/common';
import { TravelPlanningModule } from '@travel-planning/travel-planning.module';
import { UsersModule } from '@users/users.module';
import { UnitsModule } from '@units/units.module';
import { TwilioModule } from '@twilio/twilio.module';
import { NotificationsModule } from '@notifications/notifications.module';
import { NatsModule } from '@transports/nats.module';
import { IoTGatewayModule } from '@iotGateway/iot-gateway.module';
import { SocketGateway } from './socket/socket.gateway';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    UsersModule,
    TravelPlanningModule,
    UnitsModule,
    TwilioModule,
    NotificationsModule,
    UnitsModule,
    IoTGatewayModule,
    NatsModule,
    SocketModule,
  ],
  controllers: [],
  providers: [SocketGateway],
})
export class AppModule {}
