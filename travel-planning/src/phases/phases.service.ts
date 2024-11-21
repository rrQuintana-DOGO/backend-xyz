import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreatePhaseDto } from '@phases/dto/create-phase.dto';
import { UpdatePhaseDto } from '@phases/dto/update-phase.dto';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';
import { Phase } from '@phases/entities/phase.entity';
import { validatePageAndLimit } from '@app/common/exceptions/validatePages';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class PhaseService {
  private readonly logger = new Logger(PhaseService.name);

  constructor(
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async create(createPhaseDto: CreatePhaseDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const phase = await dbConnection.phases.create({
        data: createPhaseDto,
      });

      return await this.findOne(phase.id_phase, slug, phase.status);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({ 
        status: HttpStatus.BAD_REQUEST,
        message: 'Ocurrio un problema al crear la fase' 
      });
    }
  }

  async validatePhasesExist(phases: string[], field: string = 'id_phase', slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const nonExistentPhases: string[] = [];
    const existentPhases: Partial<Phase>[] = [];

    for (const phase of phases) {
      const phaseExist = await dbConnection.phases.findFirst({
        where: { [field]: phase, status: true },
        select: { id_phase: true, name: true, symbol: true },
      });

      if (!phaseExist) {
        nonExistentPhases.push(phase);
      } else {
        existentPhases.push(phaseExist);
      }
    }

    if (nonExistentPhases.length > 0) {
      throw new RpcException({
        message: nonExistentPhases.toString(),
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return existentPhases;
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit } = paginationDto;

    try {
        const [total_records, phases] = await Promise.all([
            dbConnection.phases.count({
                where: { status: true },
            }),
            dbConnection.phases.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: { status: true },
            })
        ]);

        const lastPage = Math.ceil(total_records / limit);
        validatePageAndLimit(page, lastPage);

        return {
            data: phases,
            meta: {
                total_records,
                current_page: page,
                total_pages: lastPage,
            },
        };
    } catch (error) {
      this.logger.error(error);
      const message =  error.message || 'Error al obtener las fases';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async findOne(id: string, slug: string, status = true) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const phase = await dbConnection.phases.findUnique({
      where: { id_phase: id, status },
    });

    if (!phase) {
      throw new RpcException({
        message: `La fase con el id ${id} no existe`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return phase;

  }

  async update(id: string, updatePhaseDto: UpdatePhaseDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try {
      await dbConnection.phases.update({
        where: { id_phase: id },
        data: updatePhaseDto,
      });

      return this.findOne(id, slug, updatePhaseDto.status);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({ 
        status: HttpStatus.BAD_REQUEST,
        message: `Ocurrio un problema al actualizar la fase con el id ${id}` 
      });
    }
  }
  
  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try{
      return dbConnection.phases.update({
        where: { id_phase: id },
        data: { status: false },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({ 
        status: HttpStatus.BAD_REQUEST,
        message: `Ocurrio un problema al eliminar la fase con el id ${id}` 
      });
    }
  }
}
