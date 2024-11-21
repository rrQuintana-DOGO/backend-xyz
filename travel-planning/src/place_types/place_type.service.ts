import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreatePlaceTypeDto } from '@places_types/dto/create-place_type.dto';
import { UpdatePlaceTypeDto } from '@places_types/dto/update-place_type.dto';
import { PaginationDto } from '@common/index';
import { RpcException } from '@nestjs/microservices';
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class PlacesTypesService {
  private readonly logger = new Logger(PlacesTypesService.name);
 
  constructor(
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async verifyPlaceExists(name: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const place_type = await dbConnection.place_types.findFirst({
      where: { name },
    });

    if (place_type) {
      throw new RpcException({
        message: `el tipo de lugar ${name} ya existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async create(createPlaceTypeDto: CreatePlaceTypeDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      await this.verifyPlaceExists(createPlaceTypeDto.name, slug);
    }
    catch (error) {
      this.logger.error(error);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message
      });
    }

    try {
      return dbConnection.place_types.create({
        data: createPlaceTypeDto,
      });
    }
    catch (error) {
      this.logger.error(error);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Ocurrió un error al crear el tipo de lugar'
      });
    }
  }

  
async findAll(paginationDto: PaginationDto, slug: string) {
  const dbConnection = await this.dbManager.getPostgresConnection(slug);

  const { page, limit } = paginationDto;

  try {
    const totalPages = await dbConnection.place_types.count();
    const lastPage = Math.ceil(totalPages / limit);

    validatePageAndLimit(page, lastPage);

    const fuel = await dbConnection.place_types.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { status: true },
    });

    return {
      data: fuel,
      meta: {
        total_records: totalPages,
        current_page: page,
        total_pages: lastPage,
      },
    };
  } catch (error) {
    this.logger.error(error);
    const message =  error.message || 'Error al obtener tipos de lugares';
    throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
  }
}

  async findOne(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const place_type = await dbConnection.place_types.findUnique({
      where: { id_place_type: id }
    });

    if (!place_type) {
      throw new RpcException({
        message: `Id de lugar ${id} no encontrado`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return place_type;
  }

  async update(id: string, updatePlaceTypeDto: UpdatePlaceTypeDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { id_place_type: __, ...data } = updatePlaceTypeDto;    
    await this.findOne(id, slug);

    return dbConnection.place_types.update({
      where: { id_place_type: id },
      data: updatePlaceTypeDto,
    });
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);
    return dbConnection.place_types.update({
      where: { id_place_type: id },
      data: { status: false },
    });
  }
}
