import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import * as XLSX from 'xlsx';
import {
  ExcelTripGeneralDto,
  ExcelTripDriversDto,
  ExcelTripPlacesDto,
  ExcelTripUnitsDto,
  ExcelTripEventsDto
} from '@travel-planning/trips/dto/index';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TransformExcelService {
  private readonly logger = new Logger(TransformExcelService.name);

  async transformExcel(file: Express.Multer.File) {

    const workbook = XLSX.read(file.buffer, { type: 'buffer', cellDates: true });

    const general = await this.parseAndValidateSheet(
      workbook.Sheets['General'],
      ExcelTripGeneralDto,
      'General'
    );

    const events: ExcelTripEventsDto[] = await this.parseAndValidateSheet(
      workbook.Sheets['Eventos'],
      ExcelTripEventsDto,
      'Eventos'
    );

    const drivers: ExcelTripDriversDto[] = await this.parseAndValidateSheet(
      workbook.Sheets['Conductores'],
      ExcelTripDriversDto,
      'Conductores'
    );

    const places: ExcelTripPlacesDto[] = await this.parseAndValidateSheet(
      workbook.Sheets['Lugares'],
      ExcelTripPlacesDto,
      'Lugares'
    );

    const units: ExcelTripUnitsDto[] = await this.parseAndValidateSheet(
      workbook.Sheets['Unidades'],
      ExcelTripUnitsDto,
      'Unidades'
    );


    const data = general.map(trip => ({
      ...trip,
      EVENTOS: events.filter(event => event.ID_VIAJE === trip.ID_VIAJE).map(event => event.NOMBRE_DEL_EVENTO),
      CONDUCTORES: drivers.filter(driver => driver.ID_VIAJE === trip.ID_VIAJE).map(driver => driver.NOMBRE_DEL_CONDUCTOR),
      LUGARES: places.filter(place => place.ID_VIAJE === trip.ID_VIAJE).map(place => ({
        ...place
      })),
      UNIDADES: units.filter(unit => unit.ID_VIAJE === trip.ID_VIAJE).map(unit => ({
        ...unit
      }))
    }));

    return data;

  }

  async parseAndValidateSheet(sheet: XLSX.WorkSheet, dto: any, sheetName: string) {
    const objects: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const headers = objects[0];
    const rows = objects.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== ''));
    const validData = [];
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      const obj = headers.reduce((acc, header, colIndex) => {
        acc[header] = row[colIndex];
        return acc;
      }, {});
      const dtoInstance = plainToInstance(dto, obj);
      const validationErrors = await validate(dtoInstance as object);

      if (validationErrors.length > 0) {
        const errorMessages = validationErrors.map(error => {
          this.logger.error(error);
          const constraints = Object.values(error.constraints)[0];
          const colIndex = headers.indexOf(error.property);
          const cellAddress = this.getCellAddress(rowIndex + 2, colIndex);
          this.logger.error(`Error en fila ${rowIndex + 2}, columna ${colIndex + 1}: ${constraints}`);
          return `${constraints}, revisar el valor ${error.value || 'nulo'} en la celda ${cellAddress}`;
        }).join('; ');
        throw new RpcException(`Error de validación en la hoja ${sheetName}: ${errorMessages}`);
      } else {
        validData.push(dtoInstance);
      }
    }
    return validData;
  }

  getCellAddress(rowIndex: number, colIndex: number): string {
    const columnLetter = String.fromCharCode(65 + colIndex);
    return `${columnLetter}${rowIndex}`;
  }
}