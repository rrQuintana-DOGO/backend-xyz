import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { PaginationDto } from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { Route } from '@routes/entities/route.entity';
import { DataBaseManagerService } from '@app/db_manager/db_manager.service';

@Injectable()
export class RoutesService {
  private readonly logger = new Logger(RoutesService.name);

  constructor(
    private readonly dbManager: DataBaseManagerService
  ) {}

  async create(createRouteDto: CreateRouteDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      return await dbConnection.routes.create({
        data: createRouteDto,
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Ocurrió un error al crear la ruta',
      });
    }
  }

  async validateRoutesExist(routes: string[], field: string = 'id_route', slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const nonExistentRoutes: string[] = [];
    const existentRoutes: Partial<Route>[] = [];

    for (const route of routes) {
      const routeExist = await dbConnection.routes.findFirst({
        where: { [field]: route, status: true },
        select: { id_route: true, name: true },
      });

      if (!routeExist) {
        nonExistentRoutes.push(route);
      } else {
        existentRoutes.push(routeExist);
      }
    }

    if (nonExistentRoutes.length > 0) {
      throw new RpcException({
        message: nonExistentRoutes.toString(),
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return existentRoutes;
  }

  async findAll(slug: string, paginationDto?: PaginationDto) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const { page = 1, limit = Number.MAX_SAFE_INTEGER } = paginationDto || {};

      const pageNumber = Math.max(page, 1);
      const limitNumber = limit === -1 ? Number.MAX_SAFE_INTEGER : Math.max(limit, 1);

      const totalRecords = await dbConnection.routes.count();

      const effectiveLimit = limitNumber > 0 ? limitNumber : Number.MAX_SAFE_INTEGER;

      const lastPage = Math.ceil(totalRecords / effectiveLimit);

      if (pageNumber > lastPage) {
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: 'La página solicitada no existe',
        });
      }

      const routes = await dbConnection.routes.findMany({
        skip: (pageNumber - 1) * effectiveLimit,
        take: effectiveLimit,
      });

      return {
        data: routes,
        meta: {
          total_records: totalRecords,
          current_page: paginationDto ? pageNumber : 1,
          total_pages: paginationDto ? lastPage : 1,
        },
      };
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Ocurrió un error al obtener las rutas',
      });
    }
  }

  async findOne(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const route = await dbConnection.routes.findUnique({
        where: { id_route: id },
      });

      if (!route) {
        throw new RpcException({
          message: `La ruta con id ${id} no existe`,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      return route;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Ocurrió un error al buscar la ruta con id ${id}`,
      });
    }
  }

  async update(id: string, updateRouteDto: UpdateRouteDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const { id: __, ...data } = updateRouteDto;
      await this.findOne(id, slug);

      return await dbConnection.routes.update({
        where: { id_route: id },
        data,
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Ocurrió un error al actualizar la ruta con id ${id}`,
      });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      const route = await this.findOne(id, slug);

      route.status = false;

      return await dbConnection.routes.update({
        where: { id_route: id },
        data: route,
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Ocurrió un error al eliminar la ruta con id ${id}`,
      });
    }
  }
}
