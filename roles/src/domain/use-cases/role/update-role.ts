import { RoleEntity } from "@entities/role.entities";
import { RoleRepository } from "@domain/repository/role.repository";
import { UpdateRoleDto } from "@domain/dtos";

export interface UpdateRoleUseCase {
  execute(dto: UpdateRoleDto): Promise<RoleEntity>;
}

export class UpdateRole implements UpdateRoleUseCase {
  constructor(private readonly repository: RoleRepository) {}

  execute(dto: UpdateRoleDto): Promise<RoleEntity> {
    return this.repository.updateById(dto);
  }
}
