import { NATS_SERVICE } from '@app/config';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { UUIDGuard } from '@app/common/guards/uuid-guard.decorator';
import { Auth } from '@app/common/guards/auth.decorator';

@Controller('drivers')
export class DriversController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly driversTypeDriver: ClientProxy,
  ) {}

  @Post()
  @Auth()
  async createDriver(@Body() createDriverDto: CreateDriverDto, @Request() req) {
    const data = req['data'];

    try {
      const driver = await firstValueFrom(
        this.driversTypeDriver.send(
          { cmd: 'create-driver' }, 
          { createDriverDto, slug: data.slug }
        ),
      );

      return driver;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  @Auth()
  async findAllDrivers(@Query() paginationDto: PaginationDto, @Request() req) {
    const data = req['data'];
    
    try {
      const drivers = await firstValueFrom(
        this.driversTypeDriver.send(
          { cmd: 'find-all-drivers' }, 
          { paginationDto, slug: data.slug }
        ),
      );

      return drivers;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  @Auth()
  @UUIDGuard('id')
  async findOneDriver(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const Driver = await firstValueFrom(
        this.driversTypeDriver.send(
          { cmd: 'find-one-driver' },
          { id, slug: data.slug }
        ),
      );

      return Driver;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @Auth()
  async deleteDriver(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const Driver = await firstValueFrom(
        this.driversTypeDriver.send(
          { cmd: 'remove-driver' },
          { id, slug: data.slug }
        ),
      );

      return Driver;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  @Auth()
  async updateDriver(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDriverDto: UpdateDriverDto,
    @Request() req
  ) {
    const data = req['data'];

    try {
      const driver = await firstValueFrom(
        this.driversTypeDriver.send(
          { cmd: 'update-driver' },
          { "updateDriverDto": { id_driver: id, ...updateDriverDto }, slug: data.slug } 
        ),
      );

      return driver;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
