import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateStatusDto } from '@status/dto/create-status.dto';
import { UpdateStatusDto } from '@status/dto/update-status.dto';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';
import { Status } from '@status/entities/status.entity';
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class StatusService {
  private readonly logger = new Logger(StatusService.name);

  constructor(
    private readonly dbManager: DataBaseManagerService
  ) {}

  async create(createStatusDto: CreateStatusDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const status = await dbConnection.status.create({
        data: createStatusDto,
      });

      return await this.findOne(status.id_status, slug, status.status);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Ocurrio un problema al crear la fase'
      });
    }
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit } = paginationDto;

    try {
      const [total_records, statuss] = await Promise.all([
        dbConnection.status.count({
          where: { status: true },
        }),
        dbConnection.status.findMany({
          skip: limit === -1 ? 0 : (page - 1) * limit,
          take: limit === -1 ? undefined : limit,
          where: { status: true },
          orderBy: { name: 'asc' },
        }),
      ]);

      const lastPage = limit === -1 ? 1 : Math.ceil(total_records / limit);
      validatePageAndLimit(page, lastPage);

      return {
        data: statuss,
        meta: {
          total_records,
          current_page: page,
          total_pages: lastPage,
        },
      };
    } catch (error) {
      this.logger.error(error);
      const message = error.message || 'Error al obtener los viajes';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async validateStatusesExist(statuses: string[], field: string = 'id_status', slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const nonExistentStatuses: string[] = [];
    const existentStatuses: Partial<Status>[] = [];

    for (const status of statuses) {
      const statusExist = await dbConnection.status.findFirst({
        where: { [field]: status, status: true },
        select: { id_status: true, name: true },
      });

      if (!statusExist) {
        nonExistentStatuses.push(status);
      } else {
        existentStatuses.push(statusExist);
      }
    }

    if (nonExistentStatuses.length > 0) {
      throw new RpcException({
        message: nonExistentStatuses.toString(),
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return existentStatuses;
  }

  async findOne(id: string, slug: string, status: boolean = true) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const Status = await dbConnection.status.findUnique({
      where: { id_status: id, status },
    });

    if (!Status) {
      throw new RpcException({
        message: `El estatus con el id ${id} no existe`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return Status;

  }

  async update(id: string, updateStatusDto: UpdateStatusDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try {
      await dbConnection.status.update({
        where: { id_status: id, status: true },
        data: updateStatusDto,
      });

      return this.findOne(id, slug);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Ocurrio un problema al actualizar el estatus con el id ${id}`
      });
    }
  }
  
  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try{
      return dbConnection.status.update({
        where: { id_status: id },
        data: { status: false },
      });

    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Ocurrio un problema al eliminar el estatus con el id ${id}`
      });
    }
  }
}
