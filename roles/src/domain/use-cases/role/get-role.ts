import { RoleEntity } from "@entities/role.entities";
import { RoleRepository } from "@domain/repository/role.repository";

export interface GetRoleUseCase {
  execute(id: number): Promise<RoleEntity>;
}

export class GetRole implements GetRoleUseCase {
  constructor(private readonly repository: RoleRepository) {}

  execute(id: number): Promise<RoleEntity> {
    return this.repository.findById(id);
  }
}
