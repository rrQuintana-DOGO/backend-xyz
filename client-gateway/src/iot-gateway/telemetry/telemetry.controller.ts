import { Controller, Get, Inject, Param, Query, Request } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateDatabaseDto } from '@iotGateway/db_manager/dto/create-database';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from '@config/index';
import { Auth } from '@app/common/guards/auth.decorator';
import { PaginationDto } from '@app/common';


@Controller('telemetry')
export class TelemetryController {
  constructor(
    @Inject(NATS_SERVICE) private readonly telemetryClient: ClientProxy,
  ) {}

  @Get('ident/:ident')
  @Auth()
  async findAllDataDevice(@Param('ident') ident: string, @Query() paginationDto: PaginationDto, @Request() req) {
    const data = req['data'];

    const createDatabaseDto = new CreateDatabaseDto();

    createDatabaseDto.name = data.slug;

    try {
      const database = await firstValueFrom(
        this.telemetryClient.send(
          { cmd: 'find-all-data-device' }, 
          { ident, paginationDto, slug: data.slug }
        )
      );

      return database;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':ident')
  @Auth()
  async findLastTelemetryData(@Param('ident') ident: string, @Request() req) {
    const data = req['data'];

    try {
      return this.telemetryClient.send(
        { cmd: 'get-last-telemetry-data' }, 
        { ident: ident, slug: data.slug }
      );
    }
    catch (error) {
      throw new RpcException(error);
    }
  }
}
