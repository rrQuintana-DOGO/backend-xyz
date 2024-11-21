import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { UpdateUserDto } from '@users/dto/update-user.dto';
import { PaginationDto } from '@common/index';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { RolesService } from '@roles/roles.service';
import { PermissionsService } from '@permissions/permissions.service';
import { User } from '@users/entities/user.entity';
import { TimeZonesService } from '@app/time_zones/time_zone.service';
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { DataBaseManagerService } from '@app/db_manager/db_manager.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly rolesService: RolesService,
    private readonly permissionsService: PermissionsService,
    private readonly timeZonesService: TimeZonesService,
    private readonly dbManager: DataBaseManagerService,
  ) {}

  async create(createUserDto: CreateUserDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { credential, permissions, roles, ...userDetails } = createUserDto;
    let credentialId: string;

    await this.timeZonesService.findOne(userDetails.id_time_zone, slug);

    if (permissions) {
      await this.permissionsService.validatePermissionsExist(permissions, slug);
    }

    if (roles) {
      await this.rolesService.validateRolesExist(roles, slug);
    }

    try {
      if (credential) {
        credentialId = await dbConnection.credentials.create({
            data: {
              ...credential,
              password: await bcrypt.hash(credential.password, 10),
            },
          })
          .then((credential) => credential.id_credential);
      }

      const user = await dbConnection.users.create({
        data: {
          ...userDetails,
          id_credential: credentialId,
        },
      });

      if (permissions) {
        await dbConnection.user_has_permissions.createMany({
          data: permissions.map((permission) => ({
            id_user: user.id_user,
            id_permission: permission,
          })),
        });
      }

      if (roles) {
        await dbConnection.user_has_roles.createMany({
          data: roles.map((role) => ({
            id_user: user.id_user,
            id_role: role,
          })),
        });
      }

      return this.findOne(user.id_user, slug);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: 'Error al crear el usuario',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  transformData(user: User) {
    const { user_has_permissions, user_has_roles, ...rest } = user;

    return {
      ...rest,
      permissions: user_has_permissions.map((p) => p.permissions),
      roles: user_has_roles.map((r) => r.roles),
    };
  }

  async findAll(paginationDto: PaginationDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { page, limit } = paginationDto;

    try{
      const totalPages = await dbConnection.users.count();
      const lastPage = Math.ceil(totalPages / limit);

      validatePageAndLimit(page, lastPage);

      const users = await dbConnection.users.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          credentials: true,
          time_zones: true,
          user_has_permissions: {
            select: {
              permissions: true,
            },
          },
          user_has_roles: {
            select: {
              roles: true,
            },
          },
        },
      });

      const data = users.map((user) => this.transformData(user));

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
      const message =  error.message || 'Error al obtener los usuarios';
      throw new RpcException({ message, status: HttpStatus.BAD_REQUEST });
    }
  }

  async findOne(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const user = await dbConnection.users.findUnique({
      where: { id_user: id },
      include: {
        credentials: true,
        time_zones: true,
        user_has_permissions: {
          select: {
            permissions: true,
          },
        },
        user_has_roles: {
          select: {
            roles: true,
          },
        },
      },
    });

    if (!user) {
      throw new RpcException({
        message: `No se encontró el usuario con id ${id}`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return this.transformData(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    const { roles, permissions, credential, ...userDetails } = updateUserDto;

    if (permissions) {
      await this.permissionsService.validatePermissionsExist(permissions, slug);
    }

    await this.timeZonesService.findOne(userDetails.id_time_zone, slug);

    if (permissions) {
      await this.permissionsService.validatePermissionsExist(permissions, slug);
    }

    if (roles) {
      await this.rolesService.validateRolesExist(roles, slug);
    }

    try {
      const user = await dbConnection.users.update({
        where: { id_user: id },
        data: userDetails,
      });

      const permissionOps = [];
      const roleOps = [];

      if (credential) {
        await dbConnection.credentials.update({
          where: { id_credential: user.id_credential },
          data: {
            ...credential,
            password: await bcrypt.hash(credential.password, 10),
          },
        });
      }

      if (permissions) {
        const currentPermissions = await dbConnection.user_has_permissions.findMany({
          where: { id_user: id },
          select: { id_permission: true },
        });

        const currentPermissionIds = new Set(
          currentPermissions.map((p) => p.id_permission),
        );
        const newPermissionIds = new Set(permissions);

        const permissionsToDelete = Array.from(currentPermissionIds).filter(
          (id) => !newPermissionIds.has(id),
        );
        const permissionsToAdd = Array.from(newPermissionIds).filter(
          (id) => !currentPermissionIds.has(id),
        );

        if (permissionsToDelete.length > 0) {
          permissionOps.push(
            dbConnection.user_has_permissions.deleteMany({
              where: {
                id_user: id,
                id_permission: { in: permissionsToDelete },
              },
            }),
          );
        }

        if (permissionsToAdd.length > 0) {
          permissionOps.push(
            dbConnection.user_has_permissions.createMany({
              data: permissionsToAdd.map((permission) => ({
                id_user: id,
                id_permission: permission,
              })),
            }),
          );
        }
      }

      if (roles) {
        const currentRoles = await dbConnection.user_has_roles.findMany({
          where: { id_user: id },
          select: { id_role: true },
        });

        const currentRoleIds = new Set(currentRoles.map((r) => r.id_role));
        const newRoleIds = new Set(roles);

        const rolesToDelete = Array.from(currentRoleIds).filter(
          (id) => !newRoleIds.has(id),
        );
        const rolesToAdd = Array.from(newRoleIds).filter(
          (id) => !currentRoleIds.has(id),
        );

        if (rolesToDelete.length > 0) {
          roleOps.push(
            dbConnection.user_has_roles.deleteMany({
              where: {
                id_user: id,
                id_role: { in: rolesToDelete },
              },
            }),
          );
        }

        if (rolesToAdd.length > 0) {
          roleOps.push(
            dbConnection.user_has_roles.createMany({
              data: rolesToAdd.map((role) => ({
                id_user: id,
                id_role: role,
              })),
            }),
          );
        }
      }

      await Promise.all([...permissionOps, ...roleOps]);

      return this.findOne(id, slug);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al actualizar el usuario con id ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async remove(id: string, slug: string) {
    const dbConnection = await this.dbManager.getPostgresConnection(slug);

    await this.findOne(id, slug);

    try {
      await dbConnection.user_has_permissions.deleteMany({
        where: { id_user: id },
      });

      await dbConnection.user_has_roles.deleteMany({
        where: { id_user: id },
      });

      return dbConnection.users.delete({
        where: { id_user: id },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error al eliminar el usuario con id ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
