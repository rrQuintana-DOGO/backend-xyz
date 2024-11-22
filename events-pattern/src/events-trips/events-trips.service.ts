import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { envs } from '@config/index';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class EventsTripsService implements OnModuleDestroy {

  private readonly logger = new Logger(EventsTripsService.name);
  private socket: Socket;

  constructor() {
    this.socket = io(envs.socketUrl, {
      transports: ['websocket'], 
      reconnectionAttempts: 100, 
      reconnectionDelay: 1000, 
    });

    this.socket.on('connect', () => {
      this.logger.log('Connected to Socket.IO server');
    });

    this.socket.on('disconnect', (reason) => {
      this.logger.warn(`Disconnected from Socket.IO server: ${reason}`);
    });

    this.socket.on('connect_error', (error) => {
      console.log(error);
      this.logger.error(`Connection error: ${error.message}`);
    });
  }

  async sendTelemetry(data: any) {
    if (!data.latitude || !data.longitude) {
      this.logger.error('Invalid telemetry data');
      return;
    }
    
    this.socket.emit('location', {
      latitude: data.latitude,
      longitude: data.longitude,
    });

  }

  onModuleDestroy() {
    if (this.socket) {
      this.socket.close();
      this.logger.log('Socket.IO connection closed');
    }
  }
}