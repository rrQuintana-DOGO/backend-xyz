import { RoleEntity } from "@domain/entities/role.entities";


export abstract class RoleDatasource {
  abstract saveRole(role: RoleEntity): Promise<void>;
  abstract getRoles(): Promise<RoleEntity[]>;
}