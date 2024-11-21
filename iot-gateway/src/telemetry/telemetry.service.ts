import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { DataBaseManagerService } from '@dbManager/db_manager.service';
import { MqttDataSchema } from '@mongoose/index';
import { PaginationDto } from '@common/index';

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);
  
  constructor(
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async findAllDataDevice(ident: string, slug: string, paginationDto: PaginationDto) {
    const dbConnection = await this.dbManager.getMongoConnection(slug);
    const TelemetryData = dbConnection.model('MqttData', MqttDataSchema);

    const { page, limit } = paginationDto;

    try{
      const totalRecords = await TelemetryData.countDocuments({
        ident: ident
      });
      
      const lastPage = Math.ceil(totalRecords / limit);
  
      const telemetry_data = await TelemetryData.find({
        ident: ident
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

      return {
        data: telemetry_data,
        meta: {
          total_records: totalRecords,
          current_page: page,
          total_pages: lastPage,
        },
      };
    } catch (error) {
      this.logger.error(error);
      const message =  error.message || 'Error al obtener los dispositivos';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async getLastTelemetryData(ident: string, slug: string) {
    const dbConnection = await this.dbManager.getMongoConnection(slug);
    const TelemetryData = dbConnection.model('MqttData', MqttDataSchema);

    try{
  
      const telemetry_data = await TelemetryData.findOne({ ident: ident })
      .sort({ timestamp: -1 });

      return {
        data: telemetry_data
      };
    } catch (error) {
      this.logger.error(error);
      const message =  error.message || `Error al obtener la ultima telemetria del dispositivo ${ident}`; 
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }
}
