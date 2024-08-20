import { RoleDatasource } from "@domain/datasources/role.datasource";
import { RoleEntity } from "@domain/entities/role.entities";
import { RoleRepository } from "@domain/repository/role.repository";

export class RoleRepositoryImpl implements RoleRepository {
  constructor(private readonly roleDatasource: RoleDatasource) {}

  async saveRole(role: RoleEntity): Promise<void> {
    await this.roleDatasource.saveRole(role);
  }

  async getRoles(): Promise<RoleEntity[]> {
    return this.roleDatasource.getRoles();
  }
}