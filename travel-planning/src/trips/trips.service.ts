/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateTripDto } from '@trips/dto/create-trip.dto';
import { UpdateTripDto } from '@trips/dto/update-trip.dto';
import { PaginationTripDto } from '@trips/dto/pagination-trip.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Trip } from '@trips/entities/trip.entity';
import { TripTypesService } from '@trip_types/trip_types.service';
import { JorneyTypeService } from '@journey-types/journey-types.service';
import { CarriersService } from '@carriers/carriers.service';
import { RoutesService } from '@routes/routes.service';
import { ClientService } from '@clients/clients.service';
import { PhaseService } from '@phases/phases.service';
import { StatusService } from '@status/status.service';
import { DriversService } from '@drivers/drivers.service';
import { PlacesService } from '@places/places.service';
import {
  updateHasTableRecords,
  createHasTableRecords,
} from '@common/utils/hasTableUtils';
import { NATS_SERVICE } from '@app/config';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { FilterTrip } from '@trips/entities/filter-trip.entity';
import { ExcelTripDataDto } from '@trips/dto/excel-trip-data.dto';
import { convertDateToBigInt } from '@common/utils/dataTransformUtils';
import { DataBaseManagerService } from '@dbManager/db_manager.service';
import { HttpService } from '@nestjs/axios';
import { CalculateEtaDto } from './dto/calculate-eta.dto';
import { Coords } from '@app/geofences/entities/geofence.entity';

@Injectable()
export class TripsService {
  private readonly logger = new Logger(TripsService.name);

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly tripTypesService: TripTypesService,
    private readonly journeyTypesService: JorneyTypeService,
    private readonly carriersService: CarriersService,
    private readonly routesService: RoutesService,
    private readonly clientsService: ClientService,
    private readonly phasesService: PhaseService,
    private readonly statusService: StatusService,
    private readonly driversService: DriversService,
    private readonly placesService: PlacesService,
    private readonly dbManager: DataBaseManagerService,
    private readonly httpService: HttpService,
  ) {}

  async validateArrays(createTripDto: CreateTripDto, slug: string) {
    const { drivers, places, events, units_setpoints } = createTripDto;

    if (drivers && drivers.length > 0) {
      try {
        await this.driversService.validateDriversExist(
          drivers,
          'id_driver',
          slug,
        );
      } catch (error) {
        this.logger.error(error);
        const nonExistDriversMessage = Array.isArray(error.message)
          ? error.message.join(', ')
          : error.message;
        throw new RpcException({
          message: `Los conductores ${nonExistDriversMessage} no existen`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    const placesIds = places?.map(({ id_place }) => id_place);
    if (placesIds && placesIds.length > 0) {
      try {
        await this.placesService.validatePlacesExist(
          placesIds,
          'id_place',
          slug,
        );
      } catch (error) {
        this.logger.error(error);
        const nonExistPlacesMessage = Array.isArray(error.message)
          ? error.message.join(', ')
          : error.message;
        throw new RpcException({
          message: `Los lugares ${nonExistPlacesMessage} no existen`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    if (events && events.length > 0) {
      try {
        await firstValueFrom(
          this.client.send(
            { cmd: 'validate-events' },
            { events: events, property: 'id_event', slug: slug },
          ),
        );
      } catch (error) {
        this.logger.error(error);
        const nonExistEventsMessage = Array.isArray(error.message)
          ? error.message.join(', ')
          : error.message;
        throw new RpcException({
          message: `Los eventos ${nonExistEventsMessage} no existen`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    const units = units_setpoints?.map(({ id_unit }) => id_unit);
    const setpoints = units_setpoints?.map(({ id_setpoint }) => id_setpoint);

    if (units && units.length > 0) {
      try {
        await firstValueFrom(
          this.client.send(
            { cmd: 'validate-units' },
            { units: units, property: 'id_unit', slug: slug },
          ),
        );
      } catch (error) {
        this.logger.error(error);
        const nonExistUnitsMessage = Array.isArray(error.message)
          ? error.message.join(', ')
          : error.message;
        throw new RpcException({
          message: `Las unidades ${nonExistUnitsMessage} no existen`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    if (setpoints && setpoints.length > 0) {
      try {
        await firstValueFrom(
          this.client.send(
            { cmd: 'validate-setpoints' },
            { setpoints: setpoints, property: 'id_setpoint', slug: slug},
          ),
        );
      } catch (error) {
        this.logger.error(error);
        const nonExistSetpointsMessage = Array.isArray(error.message)
          ? error.message.join(', ')
          : error.message;
        throw new RpcException({
          message: `Los setpoints ${nonExistSetpointsMessage} no existen`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }
  }

  async validateRelations(createTripDto: CreateTripDto, slug: string) {
    await this.tripTypesService.findOne(createTripDto.id_trip_type, slug);
    await this.journeyTypesService.findOne(createTripDto.id_journey_type, slug);
    await this.carriersService.findOne(createTripDto.id_carrier, slug);
    await this.routesService.findOne(createTripDto.id_route, slug);
    await this.clientsService.findOne(createTripDto.id_client, slug);
    await this.phasesService.findOne(createTripDto.id_phase, slug);
    await this.statusService.findOne(createTripDto.id_status, slug);
  }

  async validateextId(id_ext: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const id_ext_val = await dbConnection.trips.findUnique({
      where: { id_ext },
    });

    if (id_ext_val) {
      throw new RpcException({
        message: `El id_ext ${id_ext} ya existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async calculateEta(calculateEtaDto: CalculateEtaDto, slug: string) {
    const { places, speed } = calculateEtaDto;

    if (places.length < 2) {
      throw new RpcException({
        message: 'Debe especificar al menos 2 lugares para calcular el tiempo',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const coordenadas = places.map((p) => `${p.lon},${p.lat}`).join(';');
    const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${coordenadas}?overview=false`;

    try {
      const response = await lastValueFrom(this.httpService.get(osrmUrl));

      const data = response.data;

      const distanciaTotal = data.routes[0].distance / 1000;

      const tiempoViaje = distanciaTotal / speed;

      let tiempoOperativoTotal = 0;

      for (const place of places) {
        const tiempoOperativo =
          (place.departure_date - place.arrive_date) / (1000 * 60 * 60);
        tiempoOperativoTotal += tiempoOperativo;
      }

      const tiempoTotal = (tiempoViaje + tiempoOperativoTotal) * 60;

      return {
        eta_time: tiempoTotal,
        eta_human: this.displayTimeBreakdown(tiempoTotal),
        eda_number: distanciaTotal,
        eda_human: distanciaTotal.toFixed(2) + ' km',
      };
    } catch (error) {
      throw new RpcException({
        message: `Error al calcular la ruta: ${error.message}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  convertHoursToTimeStructure(hours: number) {
    const years = Math.floor(hours / (365.25 * 24));
    hours = hours % (365.25 * 24);

    const months = Math.floor(hours / (30.44 * 24));
    hours = hours % (30.44 * 24);

    const weeks = Math.floor(hours / (7 * 24));
    hours = hours % (7 * 24);

    const days = Math.floor(hours / 24);
    hours = hours % 24;

    const minutes = Math.floor(hours * 60);
    const seconds = Math.floor((hours * 60 - minutes) * 60);

    return {
      years,
      months,
      weeks,
      days,
      hours: Math.floor(hours),
      minutes,
      seconds,
    };
  }

  displayTimeBreakdown(hours: number) {
    const timeStructure = this.convertHoursToTimeStructure(hours);

    let result = '';

    if (timeStructure.years > 0) result += `${timeStructure.years} años, `;
    if (timeStructure.months > 0) result += `${timeStructure.months} meses, `;
    if (timeStructure.weeks > 0) result += `${timeStructure.weeks} semanas, `;
    if (timeStructure.days > 0) result += `${timeStructure.days} días, `;
    if (timeStructure.hours > 0) result += `${timeStructure.hours} horas, `;
    if (timeStructure.minutes > 0)
      result += `${timeStructure.minutes} minutos, `;
    if (timeStructure.seconds > 0)
      result += `${timeStructure.seconds} segundos`;

    return result || '0 segundos';
  }

  async create(createTripDto: CreateTripDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { events, places, drivers, units_setpoints, ...tripDetails } =
      createTripDto;

    if (createTripDto?.id_ext){
      await this.validateextId(createTripDto?.id_ext, slug);
    }
    await this.validateRelations(createTripDto, slug);
    await this.validateArrays(createTripDto, slug);

    tripDetails.created_at = BigInt(Math.floor(Date.now() / 1000));

    try {
      const trip = await dbConnection.trips.create({
        data: {
          ...tripDetails,
        },
      });

      
      if (events && events.length > 0) {
        const data = events.map((id_event) => ({
          id_trip: trip.id_trip,
          id_event,
        }));
        await createHasTableRecords(slug,'trip_has_events', data);
      }

      if (places && places.length > 0) {
        const data = places.map((place) => ({
          id_trip: trip.id_trip,
          ...place,
        }));
        await createHasTableRecords(slug,'trips_has_places', data);
      }

      if (drivers && drivers.length > 0) {
        const data = drivers.map((id_driver) => ({
          id_trip: trip.id_trip,
          id_driver,
        }));
        await createHasTableRecords(slug,'trip_has_drivers', data);
      }

      if (units_setpoints && units_setpoints.length > 0) {
        const data = units_setpoints.map(({ id_unit, id_setpoint }) => ({
          id_trip: trip.id_trip,
          id_unit,
          id_setpoint,
        }));
        await createHasTableRecords(slug, 'trips_has_units', data);
      }


      return this.findOne(trip.id_trip, slug);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: 'Error al crear el viaje: ' + error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async calculateExcelRowsErrors(
    objects: ExcelTripDataDto[],
    search: string,
    parentColumn: string,
    childColumn: string | null,
    columnExcel: string,
    sheet: string,
  ) {
    const searchValues = search.split(',');

    const errors: string[] = [];
    let rowCounter = 2;

    objects.forEach((obj) => {
      const parentValue = obj[parentColumn];

      if (Array.isArray(parentValue)) {
        parentValue.forEach((item) => {
          const value = childColumn ? item[childColumn] : item;
          if (searchValues.some((searchValue) => searchValue === value)) {
            errors.push(` ${columnExcel}${rowCounter} (${value})`);
          }
          rowCounter++;
        });
      } else {
        if (searchValues.some((searchValue) => searchValue === parentValue)) {
          errors.push(` ${columnExcel}${rowCounter} (${parentValue})`);
        }
      }
    });

    return `Revisar la hoja ${sheet}, los valores en las celdas: ${errors?.join(',')} no existen en la base de datos`;
  }

  async importData(objects: ExcelTripDataDto[], slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      // Names relations
      const trip_types_names = [
        ...new Set(objects.map((obj) => obj.TIPO_DE_VIAJE)),
      ];
      const journey_types_names = [
        ...new Set(objects.map((obj) => obj.TIPO_DE_RECORRIDO)),
      ];
      const carriers_names = [
        ...new Set(objects.map((obj) => obj.EMPRESA_TRANSPORTISTA)),
      ];
      const routes_names = [...new Set(objects.map((obj) => obj.RUTA))];
      const clients_names = [...new Set(objects.map((obj) => obj.CLIENTE))];
      const phases_names = [...new Set(objects.map((obj) => obj.FASE))];
      const status_names = [...new Set(objects.map((obj) => obj.ESTATUS))];
      const events_names = [...new Set(objects.flatMap((obj) => obj.EVENTOS))];
      const external_ids = [...new Set(objects.map((obj) => obj.ID_EXTERNO))];

      for (const id_ext of external_ids) {
        await this.validateextId(id_ext, slug);
      }

      // Names has relations
      const drivers_names = [
        ...new Set(objects.flatMap((obj) => obj.CONDUCTORES)),
      ];
      const places_names = [
        ...new Set(
          objects.flatMap((obj) =>
            obj.LUGARES.map((place) => place.NOMBRE_DEL_LUGAR),
          ),
        ),
      ];
      const units_names = [
        ...new Set(
          objects.flatMap((obj) =>
            obj.UNIDADES.map((unit) => unit.NOMBRE_DE_LA_UNIDAD),
          ),
        ),
      ];
      const setpoints_names = [
        ...new Set(
          objects.flatMap((obj) =>
            obj.UNIDADES.map((unit) => unit.VARIABLE_DESEADA),
          ),
        ),
      ];

      // Relations data
      let trip_types_data = [];
      let journey_types_data = [];
      let carriers_data = [];
      let routes_data = [];
      let clients_data = [];
      let phases_data = [];
      let status_data = [];

      try {
        trip_types_data = await this.tripTypesService.validateTripTypesExist(
          trip_types_names,
          'name',
          slug,
        );
      } catch (error) {
        const calculateMessage = await this.calculateExcelRowsErrors(
          objects,
          error.message,
          'TIPO_DE_VIAJE',
          null,
          'C',
          'GENERAL',
        );
        this.logger.error(calculateMessage);
        throw new RpcException({
          message: calculateMessage,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      try {
        journey_types_data =
          await this.journeyTypesService.validateJourneyTypesExist(
            journey_types_names,
            'name',
            slug,
          );
      } catch (error) {
        const calculateMessage = await this.calculateExcelRowsErrors(
          objects,
          error.message,
          'TIPO_DE_RECORRIDO',
          null,
          'D',
          'GENERAL',
        );
        this.logger.error(calculateMessage);
        throw new RpcException({
          message: calculateMessage,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      try {
        carriers_data = await this.carriersService.validateCarriersExist(
          carriers_names,
          'name',
          slug,
        );
      } catch (error) {
        const calculateMessage = await this.calculateExcelRowsErrors(
          objects,
          error.message,
          'EMPRESA_TRANSPORTISTA',
          null,
          'E',
          'GENERAL',
        );
        this.logger.error(calculateMessage);
        throw new RpcException({
          message: calculateMessage,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      try {
        routes_data = await this.routesService.validateRoutesExist(
          routes_names,
          'name',
          slug,
        );
      } catch (error) {
        const calculateMessage = await this.calculateExcelRowsErrors(
          objects,
          error.message,
          'RUTA',
          null,
          'G',
          'GENERAL',
        );
        this.logger.error(calculateMessage);
        throw new RpcException({
          message: calculateMessage,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      try {
        clients_data = await this.clientsService.validateClientsExist(
          clients_names,
          'name',
          slug,
        );
      } catch (error) {
        const calculateMessage = await this.calculateExcelRowsErrors(
          objects,
          error.message,
          'CLIENTE',
          null,
          'H',
          'GENERAL',
        );
        this.logger.error(calculateMessage);
        throw new RpcException({
          message: calculateMessage,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      try {
        phases_data = await this.phasesService.validatePhasesExist(
          phases_names,
          'symbol',
          slug,
        );
      } catch (error) {
        const calculateMessage = await this.calculateExcelRowsErrors(
          objects,
          error.message,
          'FASE',
          null,
          'J',
          'GENERAL',
        );
        this.logger.error(calculateMessage);
        throw new RpcException({
          message: calculateMessage,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      try {
        status_data = await this.statusService.validateStatusesExist(
          status_names,
          'name',
          slug,
        );
      } catch (error) {
        const calculateMessage = await this.calculateExcelRowsErrors(
          objects,
          error.message,
          'ESTATUS',
          null,
          'K',
          'GENERAL',
        );
        this.logger.error(calculateMessage);
        throw new RpcException({
          message: calculateMessage,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      let events_data = [];
      let units_data = [];
      let setpoints_data = [];
      let drivers_data = [];
      let places_data = [];

      let events = [];
      let drivers = [];
      let places = [];
      let units_setpoints = [];

      if (events_names.length > 0) {
        try {
          events_data = await firstValueFrom(
            this.client.send(
              { cmd: 'validate-events' },
              { events: events_names, property: 'name', slug: slug },
            ),
          );
        } catch (error) {
          const calculateMessage = await this.calculateExcelRowsErrors(
            objects,
            error.message,
            'EVENTOS',
            null,
            'B',
            'EVENTOS',
          );
          this.logger.error(calculateMessage);
          throw new RpcException({
            message: calculateMessage,
            status: HttpStatus.BAD_REQUEST,
          });
        }
      }

      if (drivers_names.length > 0) {
        try {
          drivers_data = await this.driversService.validateDriversExist(
            drivers_names,
            'name',
            slug,
          );
        } catch (error) {
          const calculateMessage = await this.calculateExcelRowsErrors(
            objects,
            error.message,
            'CONDUCTORES',
            null,
            'B',
            'CONDUCOTRES',
          );
          this.logger.error(calculateMessage);
          throw new RpcException({
            message: calculateMessage,
            status: HttpStatus.BAD_REQUEST,
          });
        }
      }

      if (places_names.length > 0) {
        try {
          places_data = await this.placesService.validatePlacesExist(
            places_names,
            'name',
            slug,
          );
        } catch (error) {
          const calculateMessage = await this.calculateExcelRowsErrors(
            objects,
            error.message,
            'LUGARES',
            'NOMBRE_DEL_LUGAR',
            'B',
            'LUGARES',
          );
          this.logger.error(calculateMessage);
          throw new RpcException({
            message: calculateMessage,
            status: HttpStatus.BAD_REQUEST,
          });
        }
      }

      if (units_names.length > 0) {
        try {
          units_data = await firstValueFrom(
            this.client.send(
              { cmd: 'validate-units' },
              { units: units_names, property: 'name', slug: slug },
            ),
          );
        } catch (error) {
          const calculateMessage = await this.calculateExcelRowsErrors(
            objects,
            error.message,
            'UNIDADES',
            'NOMBRE_DE_LA_UNIDAD',
            'B',
            'UNIDADES',
          );
          this.logger.error(calculateMessage);
          throw new RpcException({
            message: calculateMessage,
            status: HttpStatus.BAD_REQUEST,
          });
        }
      }

      if (setpoints_names.length > 0) {
        try {
          setpoints_data = await firstValueFrom(
            this.client.send(
              { cmd: 'validate-setpoints' },
              { setpoints: setpoints_names, property: 'name', slug: slug },
            ),
          );
        } catch (error) {
          const calculateMessage = await this.calculateExcelRowsErrors(
            objects,
            error.message,
            'UNIDADES',
            'VARIABLE_DESEADA',
            'C',
            'UNIDADES',
          );
          this.logger.error(calculateMessage);
          throw new RpcException({
            message: calculateMessage,
            status: HttpStatus.BAD_REQUEST,
          });
        }
      }

      const objects_data: CreateTripDto[] = objects.map((obj) => {
        const trip_type = trip_types_data.find(
          ({ name }) => name === obj.TIPO_DE_VIAJE,
        );
        const journey_type = journey_types_data.find(
          ({ name }) => name === obj.TIPO_DE_RECORRIDO,
        );
        const carrier = carriers_data.find(
          ({ name }) => name === obj.EMPRESA_TRANSPORTISTA,
        );
        const route = routes_data.find(({ name }) => name === obj.RUTA);
        const client = clients_data.find(({ name }) => name === obj.CLIENTE);
        const phase = phases_data.find(({ symbol }) => symbol === obj.FASE);
        const status = status_data.find(({ name }) => name === obj.ESTATUS);

        drivers = obj.CONDUCTORES.map(
          (name) =>
            drivers_data.find(({ name: driver_name }) => driver_name === name)
              .id_driver,
        );
        events = obj.EVENTOS.map(
          (name) =>
            events_data.find(({ name: event_name }) => event_name === name)
              .id_event,
        );

        places = obj.LUGARES.map((place) => {
          const place_data = places_data.find(
            ({ name }) => name === place.NOMBRE_DEL_LUGAR,
          );
          return {
            id_place: place_data.id_place,
            estimate_arrive_date: convertDateToBigInt(
              place?.FECHA_ESTIMADA_DE_LLEGADA,
            ),
            real_arrive_date: convertDateToBigInt(place?.FECHA_REAL_DE_LLEGADA),
            estimate_departure_date: convertDateToBigInt(
              place?.FECHA_ESTIMADA_DE_SALIDA,
            ),
            real_estimate_departure_date: convertDateToBigInt(
              place?.FECHA_REAL_DE_SALIDA,
            ),
            phase: place.FASE,
          };
        });

        units_setpoints = obj.UNIDADES.map((unit) => {
          const unit_data = units_data.find(
            ({ name }) => name === unit.NOMBRE_DE_LA_UNIDAD,
          );
          const setpoint_data = setpoints_data.find(
            ({ name }) => name === unit.VARIABLE_DESEADA,
          );
          return {
            id_unit: unit_data.id_unit,
            id_setpoint: setpoint_data.id_setpoint,
          };
        });

        return {
          id_ext: obj.ID_EXTERNO,
          id_trip_type: trip_type.id_trip_type,
          id_journey_type: journey_type.id_journey_type,
          id_carrier: carrier.id_carrier,
          eta: obj.ETA,
          id_route: route.id_route,
          id_client: client.id_client,
          eda: Number(obj.EDA),
          id_phase: phase.id_phase,
          id_status: status.id_status,
          kilometers: Number(obj.KILOMETROS),
          description: obj.DESCRIPCION,
          load_size: Number(obj.TAMANO_DE_CARGA),
          fuel_level_start: Number(obj.NIVEL_DE_COMBUSTIBLE_INICIAL),
          fuel_level_end: Number(obj.NIVEL_DE_COMBUSTIBLE_FINAL),
          created_at: BigInt(Math.floor(Date.now() / 1000)),
          events,
          drivers,
          places,
          units_setpoints,
        };
      });

      for (const trip of objects_data) {
        const { events, drivers, places, units_setpoints, ...data } = trip;

        const trip_data = await dbConnection.trips.create({
          data,
        });

        if (events) {
          const eventData = events.map((id_event) => ({
            id_trip: trip_data.id_trip,
            id_event,
          }));
          try {
            await createHasTableRecords(slug,'trip_has_events', eventData);
          } catch (error) {
            await dbConnection.trips.delete({
              where: { id_trip: trip_data.id_trip },
            });
            this.logger.error(error);
            throw new RpcException({
              message: `Error al crear los eventos`,
              status: HttpStatus.BAD_REQUEST,
            });
          }
        }

        if (places) {
          const placeData = places.map((place) => ({
            id_trip: trip_data.id_trip,
            ...place,
          }));
          try {
            await createHasTableRecords(slug,'trips_has_places', placeData);
          } catch (error) {
            await dbConnection.trips.delete({
              where: { id_trip: trip_data.id_trip },
            });
            this.logger.error('nada');
            throw new RpcException({
              message: 'Error al crear los lugares',
              status: HttpStatus.BAD_REQUEST,
            });
          }
        }

        if (drivers) {
          const driverData = drivers.map((id_driver) => ({
            id_trip: trip_data.id_trip,
            id_driver,
          }));
          try {
            await createHasTableRecords(slug,'trip_has_drivers', driverData);
          } catch (error) {
            await dbConnection.trips.delete({
              where: { id_trip: trip_data.id_trip },
            });
            this.logger.error(error);
            throw new RpcException({
              message: `Error al crear los conductores`,
              status: HttpStatus.BAD_REQUEST,
            });
          }
        }

        if (units_setpoints) {
          const unitSetpointData = units_setpoints.map(
            ({ id_unit, id_setpoint }) => ({
              id_trip: trip_data.id_trip,
              id_unit,
              id_setpoint,
            }),
          );
          try {
            await createHasTableRecords(slug,'trips_has_units', unitSetpointData);
          } catch (error) {
            await dbConnection.trips.delete({
              where: { id_trip: trip_data.id_trip },
            });
            this.logger.error(error);
            throw new RpcException({
              message: `Error al crear las unidades y setpoints`,
              status: HttpStatus.BAD_REQUEST,
            });
          }
        }
      }

      return {
        message: `Se han importado ${objects_data.length} viajes de forma exitosa`,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      this.logger.error(error);
      const message = error.message || 'Error al importar los viajes';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async findAll(paginationDto: PaginationTripDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit, tab, search, carrier, client, place, status } =
      paginationDto;

    const filters: FilterTrip = { deleted_at: null };

    if (tab === 'TAL') {
      try {
        const ids_trips = await firstValueFrom(
          this.client.send({ cmd: 'find-all-trips-with-alerts' }, {}),
        );
        filters.id_trip = { in: ids_trips };
      } catch (error) {
        this.logger.error(error);
        throw new RpcException({
          message: error.message,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    } else if (tab === 'TOR') {
      filters.phases = { symbol: 'TOR' };
    } else if (tab === 'TC') {
      try {
        const ids_trips = await firstValueFrom(
          this.client.send({ cmd: 'find-all-trips-completed' }, {}),
        );
        filters.id_trip = { in: ids_trips };
      } catch (error) {
        this.logger.error(error);
        throw new RpcException({
          message: error.message,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    } else if (tab === 'TNS') {
      filters.phases = { symbol: 'TNS' };
    }

    if (carrier) {
      filters.carriers = { id_carrier: carrier };
    }

    if (client) {
      filters.clients = { id_client: client };
    }

    if (place) {
      filters.trips_has_places = {
        some: {
          places: { id_place: place },
        },
      };
    }

    if (status) {
      filters.status = { id_status: status };
    }

    if (search) {
      filters.OR = [
        { carriers: { name: { contains: search, mode: 'insensitive' } } },
        { description: { contains: search, mode: 'insensitive' } },
        { clients: { name: { contains: search, mode: 'insensitive' } } },
        { trip_types: { name: { contains: search, mode: 'insensitive' } } },
        { journey_types: { name: { contains: search, mode: 'insensitive' } } },
        { phases: { name: { contains: search, mode: 'insensitive' } } },
        { status: { name: { contains: search, mode: 'insensitive' } } },
        {
          trips_has_places: {
            some: {
              places: { name: { contains: search, mode: 'insensitive' } },
            },
          },
        },
      ];
    }

    try {
      const totalRecords = await dbConnection.trips.count({
        where: filters,
      });

      const totalPages = Math.ceil(totalRecords / limit);

      validatePageAndLimit(page, totalPages);

      const trips = await dbConnection.trips.findMany({
        where: filters,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          trip_types: true,
          journey_types: true,
          carriers: true,
          routes: {
            include: {
              route_has_waypoints: {
                include: {
                  waypoints: { include: { georoutes: true } },
                },
              },
            },
          },
          clients: true,
          phases: true,
          status: true,
          trip_has_drivers: {
            include: { drivers: true },
          },
          trip_has_events: true,
          trips_has_units: true,
          trips_has_places: {
            include: {
              places: {
                include: { geofences: true },
              },
            },
          },
        },
      });

      const data = await Promise.all(
        trips.map(async (trip) => await this.transformData(trip, slug)),
      );

      return {
        data,
        meta: {
          total_records: totalRecords,
          current_page: page,
          total_pages: totalPages,
        },
      };
    } catch (error) {
      this.logger.error(error);
      const message = error.message || 'Error al obtener los viajes';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async transformData(trip: Trip, slug: string) {
    const {
      id_trip_type,
      id_journey_type,
      id_carrier,
      id_route,
      id_client,
      id_phase,
      id_status,
      trip_types,
      journey_types,
      carriers,
      routes,
      clients,
      phases,
      eta,
      created_at,
      deleted_at,
      trip_has_drivers,
      trip_has_events,
      trips_has_units,
      trips_has_places,
      ...rest
    } = trip;

    let events_data = [];
    let units_data = [];
    let setpoints_data = [];
    let units_setpoints_data = [];
    let trip_has_places_data = [];

    // Validación de eventos
    if (trip_has_events && trip_has_events.length > 0) {
      try {
        const events_ids = trip_has_events.map(({ id_event }) => id_event);
        events_data = await firstValueFrom(
          this.client.send(
            { cmd: 'validate-events' },
            { events: events_ids, property: 'id_event', slug: slug },
          ),
        );
      } catch (error) {
        this.logger.error(error);
        const message = Array.isArray(error.message)
          ? error.message.join(', ')
          : error.message;
        throw new RpcException({
          message: `Los eventos ${message} no existen`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    // Validación de unidades y setpoints
    if (trips_has_units && trips_has_units.length > 0) {
      const units_ids = trips_has_units.map(({ id_unit }) => id_unit);
      const setpoints_ids = trips_has_units.map(
        ({ id_setpoint }) => id_setpoint,
      );

      try {
        units_data = await firstValueFrom(
          this.client.send(
            { cmd: 'validate-units' },
            { units: units_ids, property: 'id_unit', slug:slug },
          ),
        );
      } catch (error) {
        this.logger.error(error);
        const message = Array.isArray(error.message)
          ? error.message.join(', ')
          : error.message;
        throw new RpcException({
          message: `Las unidades ${message} no existen`,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      try {
        setpoints_data = await firstValueFrom(
          this.client.send(
            { cmd: 'validate-setpoints' },
            { setpoints: setpoints_ids, property: 'id_setpoint', slug: slug },
          ),
        );
      } catch (error) {
        this.logger.error(error);
        const message = Array.isArray(error.message)
          ? error.message.join(', ')
          : error.message;
        throw new RpcException({
          message: `Los setpoints ${message} no existen`,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      units_setpoints_data = trips_has_units.map(
        ({ id_unit, id_setpoint }) => ({
          unit: units_data.find(({ id_unit: unit_id }) => unit_id === id_unit),
          setpoint: setpoints_data.find(
            ({ id_setpoint: setpoint_id }) => setpoint_id === id_setpoint,
          ),
        }),
      );
    }

    const getAlphabetLetter = (index: number) => String.fromCharCode(65 + index);

    // Validación de lugares
    if (trips_has_places && trips_has_places.length > 0) {
      trip_has_places_data = trips_has_places
        .sort(
          (a, b) =>
            Number(a.estimate_arrive_date) - Number(b.estimate_arrive_date),
        )
        .map((place, index) => {
          const {
            estimate_arrive_date,
            real_arrive_date,
            estimate_departure_date,
            real_estimate_departure_date,
            id_trip,
            id_place,
            places,
            ...rest
          } = place;
          
          if (!id_place || !places?.name) {
            throw new RpcException({
              message: `Lugar faltante o inválido en la posición ${index}`,
              status: HttpStatus.BAD_REQUEST,
            });
          }

          return {
            ...rest,
            icon: getAlphabetLetter(index),
            name: places.name,
            id_place : id_place,
            coords: {
              latitude: (places?.geofences?.coords as Coords)?.latitude,
              longitude: (places?.geofences?.coords as Coords)?.longitude,
            },
            latitude: (places.geofences?.coords as Coords)?.latitude,
            longitude: (places.geofences?.coords as Coords)?.longitude,
            real_arrive_date: real_arrive_date?.toString(),
            estimate_departure_date: estimate_departure_date?.toString(),
            estimate_arrive_date: estimate_arrive_date?.toString(),
            real_estimate_departure_date:
              real_estimate_departure_date?.toString(),
          };
        });
    }

    const middleIndex = Math.floor(trip_has_places_data.length / 2);
    const middlePlace = trip_has_places_data[middleIndex];

    const waypoints = routes?.route_has_waypoints
      ? routes.route_has_waypoints
          .sort((a, b) => a.waypoints.order - b.waypoints.order)
          .map(({ waypoints }) => waypoints.georoutes?.coords)
      : [];

    const routesSimplex = {
      id_route: routes?.id_route,
      name: routes?.name,
      description: routes?.description,
    };

    // Validación final de datos esenciales
    if (!eta)
      throw new RpcException({
        message: 'ETA es obligatorio',
        status: HttpStatus.BAD_REQUEST,
      });
    if (!created_at)
      throw new RpcException({
        message: 'La fecha de creación es obligatoria',
        status: HttpStatus.BAD_REQUEST,
      });

    return {
      ...rest,
      trip_type: trip_types,
      journey_type: journey_types,
      carrier: carriers,
      route: routesSimplex,
      waypoints: waypoints,
      client: clients,
      phase: phases,
      middle_point: middlePlace?.coords,
      eta: eta.toString(),
      created_at: created_at.toString(),
      deleted_at: deleted_at?.toString(),
      drivers: trip_has_drivers?.map(({ drivers }) => drivers),
      events: events_data,
      units_setpoints: units_setpoints_data,
      places: trip_has_places_data,
    };
  }

  async findOne(id: string, slug: string, deleted_at: boolean = false) {
    try {
      const dbConnection = await this.dbManager.getPostgresConnection(slug);

      const trip = await dbConnection.trips.findUnique({
        where: { id_trip: id, deleted_at: deleted_at ? { not: null } : null },
        include: {
          trip_types: true,
          journey_types: true,
          carriers: true,
          routes: {
            include: {
              route_has_waypoints: {
                include: {
                  waypoints: { include: { georoutes: true } },
                },
              },
            },
          },
          clients: true,
          phases: true,
          status: true,
          trip_has_drivers: {
            include: {
              drivers: true,
            },
          },
          trip_has_events: true,
          trips_has_units: true,
          trips_has_places: {
            include: {
              places: {
                include: { geofences: true },
              },
            },
          },
        },
      });

      if (!trip) {
        throw new RpcException({
          message: `No se encontró el viaje con id ${id}`,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      return this.transformData(trip, slug);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al obtener el viaje con id ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async update(id: string, updateTripDto: UpdateTripDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { events, places, drivers, units_setpoints, ...tripDetails } =
      updateTripDto;

    await this.validateRelations(updateTripDto, slug);
    await this.validateArrays(updateTripDto, slug);

    try {
      await dbConnection.trips.update({
        where: { id_trip: id },
        data: tripDetails,
      });

      if (events) {
        const data = events.map((id_event) => ({ id_trip: id, id_event }));
        await updateHasTableRecords(
          slug,
          'trip_has_events',
          data,
          'id_trip_has_event',
        );
      }

      if (places) {
        const data = places.map((place) => ({
          id_trip: id,
          ...place,
        }));
        await updateHasTableRecords(
          slug,
          'trips_has_places',
          data,
          'id_trips_has_places',
        );
      }

      if (drivers) {
        const data = drivers.map((id_driver) => ({ id_trip: id, id_driver }));
        await updateHasTableRecords(
          slug,
          'trip_has_drivers',
          data,
          'id_trip_has_driver',
        );
      }

      if (units_setpoints) {
        const data = units_setpoints.map(({ id_unit, id_setpoint }) => ({
          id_trip: id,
          id_unit,
          id_setpoint,
        }));
        await updateHasTableRecords(slug,'trips_has_units', data, 'id_has_units');
      }

      return this.findOne(id, slug);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al actualizar el viaje con id ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try {
      await dbConnection.trips.update({
        where: { id_trip: id },
        data: {
          deleted_at: BigInt(Math.floor(Date.now() / 1000)),
        },
      });

      return this.findOne(id, slug, true);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al eliminar el viaje con id ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findTripsByIds(trips: string[], slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const trips_data = [];
    const nonExistTrips = [];

    for (const trip of trips) {
      const trip_data = await dbConnection.trips.findUnique({
        where: { id_trip: trip },
      });

      if (!trip_data) {
        nonExistTrips.push(trip);
      } else {
        trips_data.push(this.transformData(trip_data, slug));
      }
    }

    if (nonExistTrips.length > 0) {
      throw new RpcException({
        message: `Los siguientes viajes no existen: ${nonExistTrips.join(', ')}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return trips_data;
  }
}
