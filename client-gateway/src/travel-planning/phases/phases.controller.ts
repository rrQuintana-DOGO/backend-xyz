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
  import { UpdatePhaseDto } from '@travel-planning/phases/dto/update-phase.dto';
  import { CreatePhaseDto } from '@travel-planning/phases/dto/create-phase.dto';
import { Auth } from '@app/common/guards/auth.decorator';

  @Controller('phases')
  export class PhasesController {
    private readonly logger = new Logger(PhasesController.name);
    constructor(
      @Inject(NATS_SERVICE)
      private readonly phasesClient: ClientProxy,
    ) {}
  
    @Post()
    @Auth()
    async createPhase(@Body() createPhaseDto: CreatePhaseDto, @Request() req) {
      const data = req['data'];

      try {
        const phase = await firstValueFrom(
          this.phasesClient.send(
            { cmd: 'create-phase' }, 
            { createPhaseDto, slug: data.slug }
          ),
        );
  
        return phase;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);
      }
    }
  
    @Get()
    @Auth()
    async findAllPhases(@Query() paginationDto: PaginationDto, @Request() req) {
      const data = req['data'];
      
      try {
        const phases = await firstValueFrom(
          this.phasesClient.send(
            { cmd: 'find-all-phases' }, 
            { paginationDto, slug: data.slug }
          ),
        );
  
        return phases;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);
      }
    }
  
    @Get(':id')
    @Auth()
    async findOnePhase(@Param('id') id: string, @Request() req) {
      const data = req['data'];
      
      try {
        const phase = await firstValueFrom(
          this.phasesClient.send(
            { cmd: 'find-one-phase' }, 
            { id, slug: data.slug }
          ),
        );
  
        return phase;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);
      }
    }
  
    @Delete(':id')
    @Auth()
    async deletePhase(@Param('id') id: string, @Request() req) {
      const data = req['data'];
      
      try {
        const phase = await firstValueFrom(
          this.phasesClient.send(
            { cmd: 'remove-phase' }, 
            { id, slug: data.slug }
          ),
        );
  
        return phase;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);
      }
    }
  
    @Patch(':id')
    @Auth()
    async updatePhase(
      @Param('id') id: string,
      @Body() updatePhaseDto: UpdatePhaseDto,
      @Request() req
    ) {
      const data = req['data'];
        
      try {
        const phase = await firstValueFrom(
          this.phasesClient.send(
            { cmd: 'update-phase' },
            { "updatePhaseDto": { id_phase: id, ...updatePhaseDto }, slug: data.slug }
          ),
        );
  
        return phase;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);
      }
    }
  }
  