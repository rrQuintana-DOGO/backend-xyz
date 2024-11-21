import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreatePlaceDto } from '@places/dto/create-place.dto';
import { UpdatePlaceDto } from '@places/dto/update-place.dto';
import { PaginationDto } from '@app/common';
import { RpcException, ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from '@app/config';
import { firstValueFrom } from 'rxjs';
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { Places } from '@places/entities/places.entity';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class PlacesService {
  private readonly logger = new Logger(PlacesService.name);

  constructor(
    @Inject(NATS_SERVICE)
    private readonly clientTravelPlanning: ClientProxy,
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async validateContactsExist(contacts: string[], slug: string): Promise<void> {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const nonExistentContacts: string[] = [];

    for (const contact of contacts) {
      const exists = await dbConnection.contacts.findUnique({ where: { id_contact: contact } });
      if (!exists) {
        nonExistentContacts.push(contact);
      }
    }

    if (nonExistentContacts.length > 0) {
      throw new RpcException({
        message: `Los siguientes contactos no existen: ${nonExistentContacts.join(', ')}`,
        status: HttpStatus.BAD_REQUEST
      });
    }
  }

  async validatePlaceType(id_place_type: string, slug: string): Promise<void> {
    try {
      const placeType = await firstValueFrom(
        this.clientTravelPlanning.send(
          { cmd: 'find-one-place-types' }, 
          { id: id_place_type, slug: slug }
        )
      );

      if (!placeType) {
        throw new RpcException({
          message: `El id_place_type ${id_place_type} no fue encontrado`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    } catch (error) {
      this.logger.error(`El id_place_type ${id_place_type} no fue encontrado`);
      throw new RpcException({
        message: `El id_place_type ${id_place_type} no fue encontrado`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async validateGeofence(id_geofence: string, slug: string): Promise<void> {

    try {
      const geofence = await firstValueFrom(
        this.clientTravelPlanning.send(
          { cmd: 'find-one-geofence' }, 
          { id: id_geofence, slug: slug }
        )
      );

      if (!geofence) {
        throw new RpcException({
          message: `El id_geofence ${id_geofence} no fue encontrado`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    } catch (error) {
      this.logger.error(`El id_geofence ${id_geofence} no fue encontrado`);
      throw new RpcException({
        message: `El id_geofence ${id_geofence} no fue encontrado`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async create(createPlaceDto: CreatePlaceDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.validatePlaceType(createPlaceDto.id_place_type, slug);
    await this.validateGeofence(createPlaceDto.id_geofence, slug);

    const { contacts, ...placeDetails } = createPlaceDto;
    if (contacts) {
      await this.validateContactsExist(contacts, slug);
    }

    try {
      const place = await dbConnection.places.create({
        data: placeDetails
      });

      if (contacts) {
        await dbConnection.place_has_contacts.createMany({
          data: contacts.map((contact) => ({
            id_place: place.id_place,
            id_contact: contact,
          })),
        });
      }

      return await this.findOne(place.id_place, slug);

    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al crear el lugar ${createPlaceDto.name}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

  }

  async validatePlacesExist(places: string[], field: string = 'id_place', slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const nonExistentPlaces: string[] = [];
    const existentPlaces: Partial<Places>[] = [];

    for (const place of places) {
      const placeExist = await dbConnection.places.findFirst({
        where: { [field]: place, status: true },
        select: { id_place: true, name: true },
      });

      if (!placeExist) {
        nonExistentPlaces.push(place);
      } else {
        existentPlaces.push(placeExist);
      }
    }

    if (nonExistentPlaces.length > 0) {
      throw new RpcException({
        message: nonExistentPlaces.toString(),
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return existentPlaces;
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit } = paginationDto;

    try {
      const totalRecords = await dbConnection.places.count();
      const lastPage = limit === -1 ? 1 : Math.ceil(totalRecords / limit);

      validatePageAndLimit(page, lastPage);

      const fuel = await dbConnection.places.findMany({
        skip: limit === -1 ? 0 : (page - 1) * limit,
        take: limit === -1 ? undefined : limit,
        where: { status: true },
        include: {
          place_types: true,
          geofences: true,
          place_has_contacts: true,
        },
        orderBy: { name: 'asc' },
      });

      return {
        data: fuel,
        meta: {
          total_records: totalRecords,
          current_page: page,
          total_pages: lastPage,
        },
      };
    } catch (error) {
      this.logger.error(error);
      const message = error.message || 'Error al obtener los lugares';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async findOne(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const place = await dbConnection.places.findUnique({
      where: { id_place: id, status: true },
      include: {
        place_types: true,
        geofences: true,
        place_has_contacts: true
      },
    });

    if (!place) {
      this.logger.error(`El lugar con id ${id} no encontrado`);
      throw new RpcException({
        message: `El lugar con id ${id} no encontrado`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return place;
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.validatePlaceType(updatePlaceDto.id_place_type, slug);
    await this.validateGeofence(updatePlaceDto.id_geofence, slug);

    const { contacts, ...placeDetails } = updatePlaceDto;

    await this.findOne(id, slug);

    if (contacts) {
      await this.validateContactsExist(contacts, slug);
    }

    try {
      await dbConnection.places.update({
        where: { id_place: id, status: true },
        data: updatePlaceDto,
      });

      return this.findOne(id, slug);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al actualizar el tipo de combustible ${updatePlaceDto.name}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      await this.findOne(id, slug);

      return dbConnection.places.update({
        where: { id_place: id },
        data: { status: false },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Ocurrio un problema al eliminar el lugar con el id ${id}`,
      });
    }
  }

}
