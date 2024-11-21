import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';
import { CreateSituationDto } from '@situations/dto/create-situation.dto';
import { UpdateSituationDto } from '@situations/dto/update-situations.dto';
import { Situations } from '@situations/entities/situations.entity';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class SituationsService {
  private readonly logger = new Logger(SituationsService.name);

  constructor(
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async create(createSituationDto: CreateSituationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const situation = await dbConnection.situations.create({
        data: createSituationDto,
      });

      return await this.findOne(situation.id_situation, slug, situation.status);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({ 
        status: HttpStatus.BAD_REQUEST,
        message: 'Ocurrio un problema al crear situation' 
      });
    }
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit } = paginationDto;

    try {
        const [totalRecords, situations] = await Promise.all([
            dbConnection.situations.count({
                where: { status: true },
            }),
            dbConnection.situations.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: { status: true },
            })
        ]);

        const totalPages = Math.ceil(totalRecords / limit);

        return {
            data: situations,
            meta: {
                total_records: totalRecords,
                current_page: page,
                total_pages: totalPages,
            },
        };
    } catch (error) {
        this.logger.error(error);
        throw new RpcException({ 
          status: HttpStatus.BAD_REQUEST,
          message: 'Ocurrio un problema al obtener todos los situations' 
        });
    }
  }

  async validateSituationsExist(situations: string[], field: string = 'id_situation', slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const nonExistentSituations: string[] = [];
    const existentSituations: Partial<Situations>[] = [];
  
    for (const situation of situations) {
      const situationExist = await dbConnection.situations.findFirst({
        where: { [field]: situation, status: true },
        select: { id_situation: true, name: true },
      });
  
      if (!situationExist) {
        nonExistentSituations.push(situation);
      } else {
        existentSituations.push(situationExist);
      }
    }
  
    if (nonExistentSituations.length > 0) {
      throw new RpcException({
        message: `Las siguientes situaciones no existen: ${nonExistentSituations.join(', ')}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  
    return existentSituations;
  }

  async findOne(id: string, slug: string, status: boolean = true) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const situation = await dbConnection.situations.findUnique({
      where: { id_situation: id, status },
    });

    if (!situation) {
      throw new RpcException({
        message: `La situation con el id ${id} no existe`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return situation;
  }

  async update(id: string, updateSituationDto: UpdateSituationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try {
      await dbConnection.situations.update({
        where: { id_situation: id, status: true },
        data: updateSituationDto,
      });

      return this.findOne(id, slug);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({ 
        status: HttpStatus.BAD_REQUEST,
        message: `Ocurrio un problema al actualizar la situation con el id ${id}` 
      });
    }
  }
  
  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try{
      return dbConnection.situations.update({
        where: { id_situation: id },
        data: { status: false },
      });

    } catch (error) {
      this.logger.error(error);
      throw new RpcException({ 
        status: HttpStatus.BAD_REQUEST,
        message: `Ocurrio un problema al eliminar la situation con el id ${id}` 
      });
    }
  }
}
