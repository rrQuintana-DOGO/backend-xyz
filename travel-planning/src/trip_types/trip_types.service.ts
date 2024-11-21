import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTripTypeDto } from './dto/create-trip_type.dto';
import { UpdateTripTypeDto } from './dto/update-trip_type.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { RpcException } from '@nestjs/microservices';
import { TripType } from '@trip_types/entities/trip_type.entity';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class TripTypesService {
  private readonly logger = new Logger(TripTypesService.name);

  constructor(
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async create(createTripTypeDto: CreateTripTypeDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      return dbConnection.trip_types.create({
        data: createTripTypeDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: 'An error occurred while creating the trip type',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit } = paginationDto;

    const totalPages = await dbConnection.trip_types.count({
      where: { status: true },
      orderBy: { name: 'asc' },
    });

    if (page > totalPages) {
      throw new RpcException({
        message: `La página ${page} no fue encontrada`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const lastPage = limit === -1 ? 1 : Math.ceil(totalPages / limit);

    const tripTypes = await dbConnection.trip_types.findMany({
      where: { status: true },
      skip: limit === -1 ? undefined : (page - 1) * limit,
      take: limit === -1 ? undefined : limit,
    });

    return {
      data: tripTypes,
      meta: {
        total_records: totalPages,
        current_page: page,
        total_pages: lastPage,
      },
    };
  }

  async validateTripTypesExist(
    tripTypes: string[],
    field: string = 'id_trip_type',
    slug: string,
  ) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const nonExistentTripTypes: string[] = [];
    const existentTripTypes: TripType[] = [];

    for (const tripType of tripTypes) {
      const tripTypeExist = await dbConnection.trip_types.findFirst({
        where: { [field]: tripType, status: true },
        select: { id_trip_type: true, name: true },
      });

      if (!tripTypeExist) {
        nonExistentTripTypes.push(tripType);
      } else {
        existentTripTypes.push(tripTypeExist);
      }
    }

    if (nonExistentTripTypes.length > 0) {
      throw new RpcException({
        message: nonExistentTripTypes.toString(),
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return existentTripTypes;
  }

  async findOne(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const tripType = await dbConnection.trip_types.findUnique({
      where: { id_trip_type: id, status: true },
    });

    if (!tripType) {
      throw new RpcException({
        message: `El tipo de viaje con id ${id} no existe`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return tripType;
  }

  async update(id: string, updateTripTypeDto: UpdateTripTypeDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { id_trip_type: __, ...data } = updateTripTypeDto;
    await this.findOne(id, slug);

    try {
      return dbConnection.trip_types.update({
        where: { id_trip_type: id },
        data,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: 'An error occurred while updating the trip type',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try {
      return dbConnection.trip_types.update({
        where: { id_trip_type: id },
        data: { status: false },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: 'An error occurred while deleting the trip type',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
