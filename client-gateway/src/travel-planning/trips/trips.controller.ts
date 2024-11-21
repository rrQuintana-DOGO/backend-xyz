import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Logger,
  UseInterceptors,
  UploadedFile,
  UseFilters,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationTripDto } from '@travel-planning/trips/dto/pagination-trip.dto';
import { NATS_SERVICE } from 'src/config';
import { UpdateTripDto } from '@travel-planning/trips/dto/update-trip.dto';
import { CreateTripDto } from '@travel-planning/trips/dto/create-trip.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomFileValidator } from '@common/exceptions/custom-file-validator';
import { TransformExcelService } from '@travel-planning/trips/services/transform-excel.service';
import { HttpCustomExceptionFilter } from '@app/common/exceptions/rpc-exception.filter';
import { Auth } from '@app/common/guards/auth.decorator';
import { CalculateEtaDto } from '@travel-planning/trips/dto/calculate-eta.dto';

@Controller('trips')
export class TripsController {
  private readonly logger = new Logger(TripsController.name);
  constructor(
    @Inject(NATS_SERVICE)
    private readonly tripClient: ClientProxy,
    private readonly transformExcelService: TransformExcelService,
  ) { }

  @Post()
  @Auth()
  async createTrip(@Body() createTripDto: CreateTripDto, @Request() req) {
    const data = req['data'];

    try {
      const trip = await firstValueFrom(
        this.tripClient.send(
          { cmd: 'create-trip' }, 
          { createTripDto, slug: data.slug }
        ),
      );

      return trip;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Post("import")
  @Auth()
  @UseFilters(new HttpCustomExceptionFilter())
  @UseInterceptors(FileInterceptor('file'))
  async importTrips(
    @UploadedFile(
      new CustomFileValidator(
        [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ], 5
      )
    ) file: Express.Multer.File,
  @Request() req
  ) {
    const data = req['data'];
    
    try {

      const objects = await this.transformExcelService.transformExcel(file);
      const trips = await firstValueFrom(
        this.tripClient.send(
          { cmd: 'import-trips' }, 
          { data: objects, slug: data.slug }
        ),
      );

      return trips;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      } else {
        throw new RpcException(error);
      }
    }
  }

  @Get()
  @Auth()
  async findAllTrips(@Query() paginationDto: PaginationTripDto, @Request() req) {
    const data = req['data'];
    
    try {
      const trips = await firstValueFrom(
        this.tripClient.send(
          { cmd: 'find-all-trips' }, 
          { paginationDto, slug: data.slug }
        ),
      );

      return trips;
    }
    catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Get(':id')
  @Auth()
  async findOneTrip(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const trip = await firstValueFrom(
        this.tripClient.send(
          { cmd: 'find-one-trip' }, 
          { id, slug: data.slug }
        ),
      );

      return trip;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @Auth()
  async deleteTrip(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const trip = await firstValueFrom(
        this.tripClient.send(
          { cmd: 'remove-trip' }, 
          { id, slug: data.slug }
        ),
      );

      return trip;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  @Auth()
  async updateTrip(
    @Param('id') id: string,
    @Body() updateTripDto: UpdateTripDto,
    @Request() req
  ) {
      const data = req['data'];
      
    try {
      const trip = await firstValueFrom(
        this.tripClient.send(
          { cmd: 'update-trip' },
          { "updateTripDto": { id_trip: id, ...updateTripDto }, slug: data.slug }
        ),
      );

      return trip;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Post('calculate-eta')
  @Auth()
  async calculateEta(@Body() calculateEtaDto: CalculateEtaDto, @Request() req) {
    const data = req['data'];

    try {
      const eta = await firstValueFrom(
        this.tripClient.send(
          { cmd: 'calculate-trips-eta' },
          { "calculateEtaDto": calculateEtaDto, slug: data.slug }
        )
      );

      return eta;
    } catch (error) {
      this.logger.error('Error en calculateEta:', error);
      throw new RpcException(error || 'Ha ocurrido un error al calcular el ETA.');
    }
  }
}
