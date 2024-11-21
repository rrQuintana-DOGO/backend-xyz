import { NATS_SERVICE } from '@app/config';
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
  Request,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateRouteDto } from './dto/create-route.dto';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from '@app/common';
import { UpdateRouteDto } from './dto/update-route.dto';
import { UUIDGuard } from '@app/common/guards/uuid-guard.decorator';
import { Auth } from '@app/common/guards/auth.decorator';

@Controller('routes')
export class RoutesController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly routesClient: ClientProxy,
  ) {}

  @Post()
  @Auth()
  async createRoute(@Body() createRouteDto: CreateRouteDto, @Request() req) {
    const data = req['data'];

    try {
      const route = await firstValueFrom(
        this.routesClient.send(
          { cmd: 'create-route' }, 
          { createRouteDto, slug: data.slug }
        ),
      );

      return route;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  @Auth()
  async findAllRoutes(@Query() paginationDto: PaginationDto, @Request() req) {
    const data = req['data'];
    
    try {
      const routes = await firstValueFrom(
        this.routesClient.send(
          { cmd: 'find-all-routes' }, 
          { paginationDto, slug: data.slug }
        ),
      );

      return routes;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  @Auth()
  @UUIDGuard('id')
  async findOneRoute(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const route = await firstValueFrom(
        this.routesClient.send(
          { cmd: 'find-one-route' }, 
          { id, slug: data.slug }
        ),
      );

      return route;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @Auth()
  async deleteRoute(@Param('id') id: string, @Request() req) {
    const data = req['data'];
    
    try {
      const route = await firstValueFrom(
        this.routesClient.send(
          { cmd: 'remove-route' }, 
          { id, slug: data.slug }
        ),
      );

      return route;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  @Auth()
  async updateRoute(
    @Param('id') id: string,
    @Body() updateRouteDto: UpdateRouteDto,
    @Request() req
  ) {
    const data = req['data'];
      
    try {
      const route = await firstValueFrom(
        this.routesClient.send(
          { cmd: 'update-route' },
          { "updateRouteDto": { id_route: id, ...updateRouteDto }, slug: data.slug }
        ),
      );

      return route;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
