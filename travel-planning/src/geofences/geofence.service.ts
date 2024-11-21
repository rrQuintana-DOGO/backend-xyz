import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateGeofenceDto } from '@geofences/dto/create-geofence.dto';
import { UpdateGeofenceDto } from '@geofences/dto/update-geofence.dto';
import { PaginationDto } from '@common/index';
import { RpcException } from '@nestjs/microservices';
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class GeofenceService {
  private readonly logger = new Logger(GeofenceService.name);

  constructor(
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async create(createGeofenceDto: CreateGeofenceDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try{
      return dbConnection.geofences.create({
        data: createGeofenceDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al crear el tipo de unidad ${createGeofenceDto.name}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit } = paginationDto;

    try{
      const totalPages = await dbConnection.geofences.count();
      const lastPage = Math.ceil(totalPages / limit);

      validatePageAndLimit(page, lastPage);

      const geofences = await dbConnection.geofences.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { status: true },
      });

      return {
        data: geofences,
        meta: {
          total_records: totalPages,
          current_page: page,
          total_pages: lastPage,
        },
      };
    } catch (error) {
      this.logger.error(error);
      const message =  error.message || 'Error al obtener las geocercas';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async findOne(id: string, slug: string, status: boolean = true) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const geofence = await dbConnection.geofences.findUnique({
      where: { id_geofence: id, status },
    });

    if (!geofence) {
      this.logger.error(`Geocerca con id ${id} no encontrado`);
      throw new RpcException({
        message: `Geocerca con id ${id} no encontrado`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return geofence;
  }

  async update(id: string, updateGeofenceDto: UpdateGeofenceDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { id_geofence: __, ...data } = updateGeofenceDto;
    await this.findOne(id, slug);

    try{
      return dbConnection.geofences.update({
        where: { id_geofence: id },
        data: updateGeofenceDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al actualizar la geocerca ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try{
      return dbConnection.geofences.update({
        where: { id_geofence: id },
        data: { status: false },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al eliminar la geocerca ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
