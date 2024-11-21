import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateRoleDto } from '@roles/dto/create-role.dto';
import { UpdateRoleDto } from '@roles/dto/update-role.dto';
import { PaginationDto } from '@common/index';
import { RpcException } from '@nestjs/microservices';
import { PermissionsService } from '@permissions/permissions.service';
import { Role } from '@roles/entities/role.entity';
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { DataBaseManagerService } from '@dbManager/db_manager.service';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async create(createRoleDto: CreateRoleDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { permissions, ...roleDetails } = createRoleDto;

    if (permissions) {
      await this.permissionsService.validatePermissionsExist(permissions, slug);
    }

    try {

      const role = await dbConnection.roles.create({
        data: {
          ...roleDetails,
        },
      });

      if (permissions) {
        await dbConnection.role_has_permissions.createMany({
          data: permissions.map((permission) => ({
            id_role: role.id_role,
            id_permission: permission,
          })),
        });
      }

      return await this.findOne(role.id_role, slug);

    } catch (error) {
      this.logger.error(error);
      throw new RpcException({ message: 'Error al crear el rol', status: HttpStatus.BAD_REQUEST });
    }
  }

  transformData(role: Role) {
    const { role_has_permissions, ...roleDetails } = role;

    return {
      ...roleDetails,
      permissions: role_has_permissions.map((rhp) => rhp.permissions),
    };
  }

  async validateRolesExist(roles: string[], slug: string): Promise<void> {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const nonExistentRoles: string[] = [];
  
    for (const role of roles) {
      const roleExist = await dbConnection.roles.findUnique({
        where: { id_role: role, status: true },
      });
  
      if (!roleExist) {
        nonExistentRoles.push(role);
      }
    }
  
    if (nonExistentRoles.length > 0) {
      throw new RpcException({
        message: `Los siguientes roles no existen: ${nonExistentRoles.join(', ')}`,
        status: HttpStatus.NOT_FOUND,
      });
    }
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit } = paginationDto;
  
    try {
      const totalRecords = await dbConnection.roles.count({
        where: { status: true },
      });
  
      const lastPage = limit > 0 ? Math.ceil(totalRecords / limit) : 1;
      validatePageAndLimit(page, lastPage);


      const roles = await dbConnection.roles.findMany({
        skip: limit > 0 ? (page - 1) * limit : undefined,
        take: limit > 0 ? limit : undefined,
        include: {
          role_has_permissions: {
            select: {
              permissions: true,
            },
          },
        },
        where: { status: true },
      });
  
      const transformedRoles = roles.map((role) => this.transformData(role));
  
      return {
        data: transformedRoles,
        meta: {
          total_records: totalRecords,
          current_page: page,
          total_pages: limit > 0 ? lastPage : 1,
        },
      };
    } catch (error) {
      this.logger.error(error);
      const message = error.message || 'Error al obtener los roles';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async findOne(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const role = await dbConnection.roles.findUnique({
      where: { id_role: id },
      include: {
        role_has_permissions: {
          select: {
            permissions: true,
          },
        },
      },
    });

    if (!role) {
      this.logger.error(`No se encontró el rol con el id: ${id}`);
      throw new RpcException({
        message: `No se encontró el rol con el id: ${id}`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return this.transformData(role);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { permissions, ...roleDetails } = updateRoleDto;

    if (permissions) {
        await this.permissionsService.validatePermissionsExist(permissions, slug);
    }

    try {
        await dbConnection.roles.update({
            where: { id_role: id },
            data: roleDetails,
        });

        if (permissions) {
            const currentPermissions = await dbConnection.role_has_permissions.findMany({
                where: { id_role: id },
                select: { id_permission: true },
            });

            const currentPermissionIds = new Set(currentPermissions.map(p => p.id_permission));
            const newPermissionIds = new Set(permissions);

            const permissionsToDelete = [...currentPermissionIds].filter(id => !newPermissionIds.has(id));
            const permissionsToAdd = [...newPermissionIds].filter(id => !currentPermissionIds.has(id));

            if (permissionsToDelete.length > 0) {
                await dbConnection.role_has_permissions.deleteMany({
                    where: {
                        id_role: id,
                        id_permission: { in: permissionsToDelete },
                    },
                });
            }

            if (permissionsToAdd.length > 0) {
                await dbConnection.role_has_permissions.createMany({
                    data: permissionsToAdd.map(permission => ({
                        id_role: id,
                        id_permission: permission,
                    })),
                });
            }
        }

        return this.findOne(id, slug);
    } catch (error) {
        this.logger.error(error);
        throw new RpcException({ message: `Error al actualizar el rol con id : ${id}`, status: HttpStatus.BAD_REQUEST });
    }
  }

  
  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try{
      await dbConnection.role_has_permissions.deleteMany({
        where: { id_role: id },
      });
    
      return dbConnection.roles.update({
        where: { id_role: id },
        data: { status: false },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({ message: `Error al eliminar el rol con el id : ${id}`, status: HttpStatus.BAD_REQUEST });
    }
  }
}
