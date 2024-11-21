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
  Request,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateSituationDto } from '@travel-planning/situations/dto/create-situation.dto';
import { UpdateSituationDto } from '@travel-planning/situations/dto/update-situation.dto';
import { Auth } from '@app/common/guards/auth.decorator';

@Controller('situations')
export class SituationsController {
  private readonly logger = new Logger(SituationsController.name);
  constructor(
    @Inject(NATS_SERVICE)
    private readonly situationsClient: ClientProxy,
  ) {}

  @Post()
  @Auth()
  async createSituation(@Body() createSituationDto: CreateSituationDto, @Request() req) {
    const data = req['data'];

    try {
      const situation = await firstValueFrom(
        this.situationsClient.send(
          { cmd: 'create-situation' }, 
          { createSituationDto, slug: data.slug }
        ),
      );

      return situation;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Get()
  @Auth()
  async findAllSituations(@Query() paginationDto: PaginationDto, @Request() req) {
    const data = req['data'];
    
    return this.situationsClient.send(
      { cmd: 'find-all-situations' }, 
      { paginationDto, slug: data.slug }
    );
  }

  @Get(':id')
  @Auth()
  async findOneStatus(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const situation = await firstValueFrom(
        this.situationsClient.send(
          { cmd: 'find-one-situation' }, 
          { id, slug: data.slug }
        ),
      );

      return situation;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @Auth()
  async deleteSituation(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const situation = await firstValueFrom(
        this.situationsClient.send(
          { cmd: 'remove-situation' }, 
          { id, slug: data.slug }
        ),
      );

      return situation;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  @Auth()
  async updateStatus(
    @Param('id') id: string,
    @Body() updateSituationDto: UpdateSituationDto,
    @Request() req
  ) {
    const data = req['data'];

    try {
      const situation = await firstValueFrom(
        this.situationsClient.send(
          { cmd: 'update-situation' },
          { "updateSituationDto": { id_situation: id, ...updateSituationDto }, slug: data.slug }
        ),
      );

      return situation;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
