import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(8001, { transports: ['websocket'], cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private readonly logger = new Logger(SocketGateway.name);
  private subscribedClients = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
    this.subscribedClients.delete(client.id);
  }

  sendMessageToClients(event: string, data: any) {
    this.server.emit(event, data);
  }

  @SubscribeMessage('location')
  handleMicroserviceMessage(@MessageBody() data: any): void {
    this.server.emit('location', data);
  }
  
}
