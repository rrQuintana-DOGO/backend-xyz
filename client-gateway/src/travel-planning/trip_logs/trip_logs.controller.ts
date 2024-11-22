import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from '@common/index';
import { NATS_SERVICE} from '@config/index';
import { CreateTripLogDto } from '@travel-planning/trip_logs/dto/create-trip_logs.dto';
import { Auth } from '@app/common/guards/auth.decorator';

@Controller('tripLogs')
export class TripLogsController {
  private readonly logger = new Logger(TripLogsController.name)

  constructor(
    @Inject(NATS_SERVICE) private readonly tripLogsClient: ClientProxy,
  ) {}

  @Post()
  @Auth()
  async createTripLog(@Body() createTripLogDto: CreateTripLogDto, @Request() req) {
    const data = req['data'];

    try {
      const trip_log = await firstValueFrom(
        this.tripLogsClient.send(
          { cmd: 'create-trip-log' }, 
          { createTripLogDto, slug: data.slug }
        ),
      );

      return trip_log;
    } catch (error) {
      this.logger.error('Error al crear trip_log', error);
      throw new RpcException(error);
    }
  }

  @Get('trip/:id')
  @Auth()
  async findLogsById(@Param('id') id: string, @Request() req: any, @Query() paginationDto: PaginationDto) {
    const data = req['data'];
    
    try {
      const trip_logs = await firstValueFrom(
        this.tripLogsClient.send(
          { cmd: 'find-logs-by-id' }, 
          { id, slug: data.slug, paginationDto }
        ),
      );

      return trip_logs;
    } catch (error) {
      this.logger.error('Error al buscar trip_logs', error);
      throw new RpcException(error);    }
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    return this.tripLogsClient.send(
      { cmd: 'find-one-trip-log' }, 
      { id, slug: data.slug }
    );
  }
}
