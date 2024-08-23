import { RoleEntity } from "@domain/entities/role.entities";
import { RoleRepository } from "@domain/repository/role.repository";

export interface DeleteRoleUseCase {
    execute (id: number): Promise<RoleEntity>
}

export class DeleteRole implements DeleteRoleUseCase {
    constructor(
        private readonly repository: RoleRepository
    ) {}

    execute(id: number): Promise<RoleEntity> {
        return this.repository.deleteById(id);
    }
}