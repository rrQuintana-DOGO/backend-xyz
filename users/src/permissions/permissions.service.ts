import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreatePermissionDto } from '@permissions/dto/create-permission.dto';
import { UpdatePermissionDto } from '@permissions/dto/update-permission.dto';
import { PaginationDto } from '@common/index';
import { RpcException } from '@nestjs/microservices';
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { DataBaseManagerService } from '@app/db_manager/db_manager.service';

@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);

  constructor(
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async create(createPermissionDto: CreatePermissionDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);
    
    try{
      return dbConnection.permissions.create({
        data: createPermissionDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({ message: 'Error al crear el permiso', status: HttpStatus.BAD_REQUEST});
    }
  }

  async validatePermissionsExist(permissions: string[], slug: string): Promise<void> {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const nonExistentPermissions : string[] = [];

    for (const permission of permissions) {
      const permissionExist = await dbConnection.permissions.findUnique({
        where: { id_permission: permission, status: true },
      });

      if (!permissionExist) {
        nonExistentPermissions.push(permission);
      }
    }

    if (nonExistentPermissions.length > 0) {
      throw new RpcException({
        message: `Los siguientes permisos no existen: ${nonExistentPermissions.join(', ')}`,
        status: HttpStatus.NOT_FOUND,
      });
    }
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit } = paginationDto;

    try{
      const totalPages = await dbConnection.permissions.count({
        where: { status: true },
      });
      
      const lastPage = Math.ceil(totalPages / limit);

      validatePageAndLimit(page, lastPage);

      const permissions = await dbConnection.permissions.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { status: true },
      });

      return {
        data: permissions,
        meta: {
          total_records: totalPages,
          current_page: page,
          total_pages: lastPage,
        },
      };
    } catch (error) {
      this.logger.error(error);
      const message =  error.message || 'Error al obtener los permisos';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async findOne(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const permission = await dbConnection.permissions.findUnique({
      where: { id_permission: id },
    });

    if (!permission) {
      throw new RpcException({
        message: `No se encontró el permiso con el id: ${id}`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return permission;
  }

  async update(id: string, updateDeviceTypeDto: UpdatePermissionDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { id_permission: __, ...data } = updateDeviceTypeDto;    
    await this.findOne(id, slug);

    try{
      return dbConnection.permissions.update({
        where: { id_permission:id },
        data: updateDeviceTypeDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({ message: 'Error al actualizar el permiso', status: HttpStatus.BAD_REQUEST });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try{
      return dbConnection.permissions.update({
        where: { id_permission: id },
        data: { status: false },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({ message: 'Error al eliminar el permiso', status: HttpStatus.BAD_REQUEST });
    }
  }
}
