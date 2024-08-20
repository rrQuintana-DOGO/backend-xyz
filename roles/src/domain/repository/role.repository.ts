import { RoleEntity } from "@domain/entities/role.entities";

export abstract class RoleRepository {  
  abstract saveRole(role: RoleEntity): Promise<void>;
  abstract getRoles(): Promise<RoleEntity[]>;
}