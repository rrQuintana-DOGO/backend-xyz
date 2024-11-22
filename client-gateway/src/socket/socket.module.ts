import { Module, forwardRef } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { NatsModule } from '@app/transports/nats.module';

@Module({
  imports: [forwardRef(() => NatsModule)],
  providers: [SocketGateway],
  exports: [],
})
export class SocketModule {}
