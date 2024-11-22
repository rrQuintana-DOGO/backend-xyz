import { PaginationDto } from '@common/index';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TelemetryService } from '@telemetry/telemetry.service';

@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) { }

  @MessagePattern({ cmd: 'find-all-data-device' })
  findAll(@Payload() data: { ident: string, slug: string, paginationDto: PaginationDto }) {
    const { ident, paginationDto, slug } = data;

    return this.telemetryService.findAllDataDevice(ident, slug, paginationDto);
  }

  @MessagePattern({ cmd: 'get-last-telemetry-data' })
  findLastTelemetry(@Payload() data: { ident: string, slug: string }) {
    const { ident, slug } = data;

    return this.telemetryService.getLastTelemetryData(ident, slug);
  }

  @MessagePattern('mqtt-data-processed')
  handleProcessedData(data: any) {
    //console.log('Mensaje recibido:', data);
    // Lógica para procesar el mensaje
  }
}
