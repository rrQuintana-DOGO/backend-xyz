import { CreateRoleDto } from "@domain/dtos";
import { RoleEntity } from "@entities/role.entities";
import { RoleRepository } from "@domain/repository/role.repository";

export interface CreateRoleUseCase {
    execute (role: CreateRoleDto): Promise<RoleEntity>
}

export class CreateRole implements CreateRoleUseCase {
    constructor(private readonly roleRepository: RoleRepository) {}

    async execute(role: CreateRoleDto): Promise<RoleEntity> {
        const roleCreated = await this.roleRepository.create(role);
        return roleCreated;
    }
}
