import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateModuleDto } from '@modules/dto/create-module.dto';
import { UpdateModuleDto } from '@modules/dto/update-module.dto';
import { PaginationDto } from '@common/index';
import { RpcException } from '@nestjs/microservices';
import { PermissionsService } from '@app/permissions/permissions.service';
import { Module } from '@modules/entities/modules.entity';
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class ModulesService {
  private readonly logger = new Logger(ModulesService.name);

  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async create(createModuleDto: CreateModuleDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const {  permissions, ...moduleDetails } = createModuleDto;

    if (permissions) {
      await this.permissionsService.validatePermissionsExist(permissions, slug);
    }

    try {

      const module = await dbConnection.modules.create({
        data: moduleDetails,
      });

      if (permissions) {
        await dbConnection.module_has_permissions.createMany({
          data: permissions.map((permission) => ({
            id_module: module.id_module,
            id_permission: permission,
          })),
        });
      }

      return this.findOne(module.id_module, slug);

    } catch (error) {
      this.logger.error(error);
      throw new RpcException({ message: 'Error al crear el módulo', status: HttpStatus.BAD_REQUEST });
    }
  }

  transformData(module: Module) {
    const { module_has_permissions, ...moduleDetails } = module;

    return {
      ...moduleDetails,
      permissions: module_has_permissions.map((mhp) => mhp.permissions
      ),
    };
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit } = paginationDto;

    try{

      const totalPages = await dbConnection.modules.count();
      const lastPage = Math.ceil(totalPages / limit);
      validatePageAndLimit(page, lastPage);
      
      const modules = await dbConnection.modules.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { status: true },
        include: {
          module_has_permissions: {
            select: {
              permissions: true,
            },
          },
        },
      });

      const data = modules.map((module) => this.transformData(module));

      return {
        data,
        meta: {
          total_records: totalPages,
          current_page: page,
          total_pages: lastPage,
        },
      };
    } catch (error) {
      this.logger.error(error);
      const message =  error.message || 'Error al obtener los módulos';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async findOne(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const module = await dbConnection.modules.findUnique({
      where: { id_module: id, status: true },
      include: {
        module_has_permissions: {
          select: {
            permissions: true,
          },
        },
      },
    });

    if (!module) {
      this.logger.error(`No se encontró el módulo con id: ${id}`);
      throw new RpcException({
        message: `No se encontró el módulo con id: ${id}`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return this.transformData(module);
  }

  async update(id: string, updateModuleDto: UpdateModuleDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { permissions, ...moduleDetails } = updateModuleDto;

    if (permissions) {
        await this.permissionsService.validatePermissionsExist(permissions, slug);
    }

    try {
        await dbConnection.modules.update({
            where: { id_module: id },
            data: moduleDetails,
        });

        if (permissions) {
            const currentPermissions = await dbConnection.module_has_permissions.findMany({
                where: { id_module: id },
                select: { id_permission: true },
            });

            const currentPermissionIds = new Set(currentPermissions.map(p => p.id_permission));
            const newPermissionIds = new Set(permissions);

            const permissionsToDelete = [...currentPermissionIds].filter(id => !newPermissionIds.has(id));
            const permissionsToAdd = [...newPermissionIds].filter(id => !currentPermissionIds.has(id));

            if (permissionsToDelete.length > 0) {
                await dbConnection.module_has_permissions.deleteMany({
                    where: {
                        id_module: id,
                        id_permission: { in: permissionsToDelete },
                    },
                });
            }

            if (permissionsToAdd.length > 0) {
                await dbConnection.module_has_permissions.createMany({
                    data: permissionsToAdd.map(permission => ({
                        id_module: id,
                        id_permission: permission,
                    })),
                });
            }
        }

        return this.findOne(id, slug);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al actualizar el módulo con id: ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    try {
      await this.findOne(id, slug);
  
      await dbConnection.module_has_permissions.deleteMany({
        where: { id_module: id },
      });
  
      return dbConnection.modules.update({
        where: { id_module: id },
        data: { status: false },
      });

    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al eliminar el módulo con id: ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
