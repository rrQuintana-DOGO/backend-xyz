import { RoleEntity } from "@entities/role.entities";
import { RoleRepository } from "@domain/repository/role.repository";

export interface GetRolesUseCase {
  execute(): Promise<RoleEntity[]>;
}

export class GetRoles implements GetRolesUseCase {
  constructor(private readonly repository: RoleRepository) {}

  execute(): Promise<RoleEntity[]> {
    return this.repository.getAll();
  }
}
