import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateEvidenceDto } from '@evidences/dto/create-evidence.dto';
import { UpdateEvidenceDto } from '@evidences/dto/update-evidence.dto';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';
import { Evidence as EvidenceEntity } from '@evidences/entities/evidence.entity';
import { evidencesSchema } from "@mongo/models/evidences.model";
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { StorageService } from '@storage/storage.service';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class EvidenceService {
  private readonly logger = new Logger(EvidenceService.name);
  constructor(
    private readonly storageService: StorageService,
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async create(createEvidenceDto: CreateEvidenceDto, slug: string) {
    const dbConnection = await this.dbManager.getMongoConnection(slug);
    const Evidences = dbConnection.model('evidences', evidencesSchema);

    const { related } = createEvidenceDto;

    try {
      const evidence: EvidenceEntity = await Evidences.create({
        ...createEvidenceDto,
        related: JSON.parse(related)
      }
      );

      return await this.findOne(evidence._id, slug);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Ocurrio un problema al crear la evidencia'
      });
    }
  }

  async transformData(evidence: EvidenceEntity) {
    const evidecnceURL = await this.storageService.getSignedUrl(evidence.url, evidence.content_type);
    evidence.url = evidecnceURL;
    return evidence;
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getMongoConnection(slug);
    const Evidences = dbConnection.model('evidences', evidencesSchema);

    const { page, limit } = paginationDto;

    try {
      const totalRecords = await Evidences.countDocuments();
      const totalPages = Math.ceil(totalRecords / limit);
      const lastPage = Math.ceil(totalPages / limit);

      validatePageAndLimit(page, lastPage);

      const evidences = await Evidences.find()
        .skip((page - 1) * limit)
        .limit(limit);


      const transformedEvidences = await Promise.all(evidences.map(evidence => this.transformData(evidence)));

      return {
        data: transformedEvidences,
        meta: {
          total_records: totalRecords,
          current_page: page,
          total_pages: lastPage,
        },
      };
    } catch (error) {
        this.logger.error(error);
        const message =  error.message || 'Error al obtener las evidencias';
        throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async findOne(id: string, slug: string) {
    const dbConnection = await this.dbManager.getMongoConnection(slug);
    const Evidences = dbConnection.model('evidences', evidencesSchema);

    const evidence = await Evidences.findById(id);

    if (!evidence) {
      throw new RpcException({
        message: `El evidencee con el id ${id} no existe`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return this.transformData(evidence);
  }

  async update(id: string, updateEvidenceDto: UpdateEvidenceDto, slug: string) {
    const dbConnection = await this.dbManager.getMongoConnection(slug);
    const Evidences = dbConnection.model('evidences', evidencesSchema);

    const { related } = updateEvidenceDto;
    const evidence_old = await this.findOne(id, slug);
    try {
      await this.storageService.deleteFile(evidence_old.file_name);
      await Evidences.findByIdAndUpdate(id, 
        {
          ...updateEvidenceDto,
          related: JSON.parse(related)
        }
      );
      return this.findOne(id, slug);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Ocurrio un problema al actualizar la evidencia con el id ${id}`
      });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getMongoConnection(slug);
    const Evidences = dbConnection.model('evidences', evidencesSchema);

    const evidence = await this.findOne(id, slug);

    try {
      await this.storageService.deleteFile(evidence.file_name);
      await Evidences.findByIdAndDelete(id);
      
      return evidence;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Ocurrio un problema al eliminar la evidencia con el id ${id}`
      });
    }
  }
}
