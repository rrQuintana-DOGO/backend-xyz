import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Logger,
    Param,
    Patch,
    Post,
    Query,
    Request,
  } from '@nestjs/common';
  import { ClientProxy, RpcException } from '@nestjs/microservices';
  import { firstValueFrom } from 'rxjs';
  import { PaginationDto } from 'src/common';
  import { NATS_SERVICE } from 'src/config';
  import { CreateJourneyTypeDto } from '@travel-planning/journey_types/dto/create-journey-type.dto';
  import { UpdateJourneyTypeDto } from '@travel-planning/journey_types/dto/update-journey-type.dto';
import { Auth } from '@app/common/guards/auth.decorator';
  
  @Controller('journey-types')
  export class JourneyTypesController {
    private readonly logger = new Logger(JourneyTypesController.name);
    constructor(
      @Inject(NATS_SERVICE)
      private readonly journeyTypesClient: ClientProxy,
    ) {}
  
    @Post()
    @Auth()
    async createJourneyType(@Body() createJourneyTypeDto: CreateJourneyTypeDto, @Request() req) {
      const data = req['data'];

      try {
        const journeyType = await firstValueFrom(
          this.journeyTypesClient.send(
            { cmd: 'create-journey-type' }, 
            { createJourneyTypeDto, slug: data.slug }
          ),
        );
  
        return  journeyType;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);
      }
    }
  
    @Get()
    @Auth()
    async findAllJourneyTypes(@Query() paginationDto: PaginationDto, @Request() req) {
      const data = req['data'];
      
      try {
        const journeyTypes = await firstValueFrom(
          this.journeyTypesClient.send(
            { cmd: 'find-all-journey-types' }, 
            { paginationDto, slug: data.slug }
          ),
        );
  
        return journeyTypes;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);
      }
    }
  
    @Get(':id')
    @Auth()
    async findOneJourneyType(@Param('id') id: string, @Request() req) {
      const data = req['data'];
      
      try {
        const journeyType = await firstValueFrom(
          this.journeyTypesClient.send(
            { cmd: 'find-one-journey-type' }, 
            { id, slug: data.slug }
          ),
        );
  
        return journeyType;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);
      }
    }
  
    @Delete(':id')
    @Auth()
    async deleteJourneyType(@Param('id') id: string, @Request() req) {
      const data = req['data'];
      
      try {
        const journeyType = await firstValueFrom(
          this.journeyTypesClient.send(
            { cmd: 'remove-journey-type' }, 
            { id, slug: data.slug }
          ),
        );
  
        return journeyType;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);
      }
    }
  
    @Patch(':id')
    @Auth()
    async updateJourneyType(
      @Param('id') id: string,
      @Body() updateJourneyTypeDto: UpdateJourneyTypeDto,
      @Request() req
    ) {
      const data = req['data'];
      
      try {
        const journeyType = await firstValueFrom(
          this.journeyTypesClient.send(
            { cmd: 'update-journey-type' },
            { "updateJourneyTypeDto": { id_journey_type: id, ...updateJourneyTypeDto }, slug: data.slug }
          ),
        );
  
        return journeyType;
      } catch (error) {
        this.logger.error(error);
        throw new RpcException(error);
      }
    }
  }
  