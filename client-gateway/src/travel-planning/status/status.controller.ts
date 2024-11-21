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
import { UpdateStatusDto } from '@travel-planning/status/dto/update-status.dto';
import { CreateStatusDto } from '@travel-planning/status/dto/create-status.dto';
import { Auth } from '@app/common/guards/auth.decorator';

@Controller('status')
export class StatussController {
  private readonly logger = new Logger(StatussController.name);
  constructor(
    @Inject(NATS_SERVICE)
    private readonly statusClient: ClientProxy,
  ) {}

  @Post()
  @Auth()
  async createStatus(@Body() createStatusDto: CreateStatusDto, @Request() req) {
    const data = req['data'];

    try {
      const status = await firstValueFrom(
        this.statusClient.send(
          { cmd: 'create-status' }, 
          { createStatusDto, slug: data.slug }
        ),
      );

      return status;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Get()
  @Auth()
  async findAllStatuses(@Query() paginationDto: PaginationDto, @Request() req) {
    const data = req['data'];
    
    try {
      const status = await firstValueFrom(
        this.statusClient.send(
          { cmd: 'find-all-status' }, 
          { paginationDto, slug: data.slug }
        ),
      );

      return status;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Get(':id')
  @Auth()
  async findOneStatus(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const status = await firstValueFrom(
        this.statusClient.send(
          { cmd: 'find-one-status' }, 
          { id, slug: data.slug }
        ),
      );

      return status;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @Auth()
  async deleteStatus(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const status = await firstValueFrom(
        this.statusClient.send(
          { cmd: 'remove-status' }, 
          { id, slug: data.slug }
        ),
      );

      return status;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  @Auth()
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
    @Request() req
  ) {
    const data = req['data'];
      
    try {
      const status = await firstValueFrom(
        this.statusClient.send(
          { cmd: 'update-status' },
          { "updateStatusDto": { id_status: id, ...updateStatusDto }, slug: data.slug }
        ),
      );

      return status;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
