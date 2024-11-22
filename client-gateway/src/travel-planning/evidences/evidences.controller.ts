import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Logger,
  UseInterceptors,
  UploadedFile,
  Request
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { UpdateEvidenceDto } from '@travel-planning/evidences/dto/update-evidence.dto';
import { CreateEvidenceDto } from '@travel-planning/evidences/dto/create-evidence.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CustomFileValidator } from '@common/exceptions/custom-file-validator';
import { StorageService } from '@storage/storage.service';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from '@app/common/guards/auth.decorator';

@Controller('evidences')
export class EvidencesController {
  private readonly logger = new Logger(EvidencesController.name);
  constructor(
    @Inject(NATS_SERVICE)
    private readonly evidenceClient: ClientProxy,
    private readonly storgeService: StorageService,
  ) { }

  @Post()
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  async createEvidence(
    @UploadedFile(
      new CustomFileValidator(
        [
          'image/jpeg',
          'image/png',
          'application/pdf',
        ], 5
      )
    ) file: Express.Multer.File,
    @Body() createEvidenceDto: CreateEvidenceDto,
    @Request() req
  ) {
    const data = req['data'];

    try {
      const file_name = `${uuidv4()}-${file.originalname}`;
      const url = await this.storgeService.uploadFile(file_name, file.buffer);
      createEvidenceDto.url = url;
      createEvidenceDto.content_type = file.mimetype;
      createEvidenceDto.file_name = file_name;
      const evidence = await firstValueFrom(
        this.evidenceClient.send(
          { cmd: 'create-evidence' }, 
          { createEvidenceDto, slug: data.slug }
        ),
      );

      return evidence;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Get()
  @Auth()
  async findAllEvidences(@Query() paginationDto: PaginationDto, @Request() req: any) {
    const data = req['data'];

    try {
      const evidences = await firstValueFrom(
        this.evidenceClient.send(
          { cmd: 'find-all-evidences' }, 
          { paginationDto, slug: data.slug }
        ),
      );

      return evidences;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Get(':id')
  @Auth()
  async findOneEvidence(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const evidence = await firstValueFrom(
        this.evidenceClient.send(
          { cmd: 'find-one-evidence' }, 
          { id, slug: data.slug }
        ),
      );

      return evidence;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @Auth()
  async deleteEvidence(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const evidence = await firstValueFrom(
        this.evidenceClient.send(
          { cmd: 'remove-evidence' }, 
          { id, slug: data.slug }
        ),
      );

      return evidence;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  async updateEvidence(
    @Param('id') id: string,
    @UploadedFile(
      new CustomFileValidator(
        [
          'image/jpeg',
          'image/png',
          'application/pdf',
        ], 5
      )
    ) file: Express.Multer.File,
    @Body() updateEvidenceDto: UpdateEvidenceDto,
    @Request() req
  ) {
    const data = req['data'];
      
    try {
      const file_name = `${uuidv4()}-${file.originalname}`;
      const url = await this.storgeService.uploadFile(file_name, file.buffer);
      updateEvidenceDto.url = url;
      updateEvidenceDto.content_type = file.mimetype;
      updateEvidenceDto.file_name = file_name;
      updateEvidenceDto._id = id;

      const evidence = await firstValueFrom(
        this.evidenceClient.send(
          { cmd: 'update-evidence' },
          { "updateEvidenceDto": { id_evidence: id, ...updateEvidenceDto }, slug: data.slug }
        ),
      );

      return evidence;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
