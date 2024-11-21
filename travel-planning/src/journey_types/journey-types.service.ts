import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateJourneyTypeDto } from '@journey-types/dto/create-journey-type.dto';
import { UpdateJourneyTypeDto} from '@journey-types/dto/update-journey-type.dto';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';
import { JourneyType } from '@journey-types/entities/journey-type.entity';
import { DataBaseManagerService } from '@app/db_manager/db_manager.service';

@Injectable()
export class JorneyTypeService {
  private readonly logger = new Logger(JorneyTypeService.name);

  constructor(
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async create(createJourneyTypeDto: CreateJourneyTypeDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const journeytype = await dbConnection.journey_types.create({
        data: createJourneyTypeDto,
      });

      return await this.findOne(journeytype.id_journey_type, slug, journeytype.status);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Ocurrio un problema al crear el tipo de recorrido'
      });
    }
  }

  async validateJourneyTypesExist(journeyTypes: string[], field: string = 'id_journey_type', slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const nonExistentJourneyTypes: string[] = [];
    const existentJourneyTypes: Partial<JourneyType>[] = [];

    for (const journeyType of journeyTypes) {
      const journeyTypeExist = await dbConnection.journey_types.findFirst({
        where: { [field]: journeyType, status: true },
        select: { id_journey_type: true, name: true },
      });

      if (!journeyTypeExist) {
        nonExistentJourneyTypes.push(journeyType);
      } else {
        existentJourneyTypes.push(journeyTypeExist);
      }
    }

    if (nonExistentJourneyTypes.length > 0) {
      throw new RpcException({
        message: nonExistentJourneyTypes.toString(),
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return existentJourneyTypes;
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit } = paginationDto;

    try {
      const [totalRecords, journeytypes] = await Promise.all([
        dbConnection.journey_types.count({
          where: { status: true },
        }),
        dbConnection.journey_types.findMany({
          skip: limit === -1 ? undefined : (page - 1) * limit,
          take: limit === -1 ? undefined : limit,
          where: { status: true },
          orderBy: { name: 'asc' },
        }),
      ]);

      const totalPages = limit === -1 ? 1 : Math.ceil(totalRecords / limit);

      return {
        data: journeytypes,
        meta: {
          total_records: totalRecords,
          current_page: page,
          total_pages: totalPages,
        },
      };
    } catch (error) {
      this.logger.error(error);
      const message = error.message || 'Error al obtener los tipos de recorrido';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async findOne(id: string, slug: string, status = true) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const journeytype = await dbConnection.journey_types.findUnique({
      where: { id_journey_type: id, status },
    });

    if (!journeytype) {
      throw new RpcException({
        message: `El tipo de recorrido con el id ${id} no existe`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return journeytype;

  }

  async update(id: string, updateJorneyTypeDto: UpdateJourneyTypeDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try {
      await dbConnection.journey_types.update({
        where: { id_journey_type: id },
        data: updateJorneyTypeDto,
      });

      return this.findOne(id, slug, updateJorneyTypeDto.status);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Ocurrio un problema al obtener el tipo de recorrido con el id ${id}`
      });
    }
  }
  
  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try{
      return dbConnection.journey_types.update({
        where: { id_journey_type: id },
        data: { status: false },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Ocurrio un problema al eliminar el tipo de recorrido con el id ${id}`
      });
    }
  }
}
