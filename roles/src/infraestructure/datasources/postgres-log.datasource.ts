import { PrismaClient } from "@prisma/client";
import { RoleEntity } from "@domain/entities/role.entities";
import { RoleDatasource } from "@domain/datasources/role.datasource";

const prismaCliente = new PrismaClient();

export class PostgresLogDataSource implements RoleDatasource {
  async saveRole(role: RoleEntity): Promise<void> {
    await prismaCliente.roleModel.create({
      data: { ...role },
    });
  }

  async getRoles(): Promise<RoleEntity[]> {
    const dbRoles = await prismaCliente.roleModel.findMany();
    return dbRoles.map(RoleEntity.fromObject);
  }
}
