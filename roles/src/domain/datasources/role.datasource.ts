import { CreateRoleDto, UpdateRoleDto } from "@dtos/index";
import { RoleEntity } from "@entities/role.entities";
export abstract class RoleDatasource {
  abstract create (creadeRoleDto: CreateRoleDto): Promise<RoleEntity>;
  abstract getaAll (): Promise<RoleEntity[]>;
  abstract findById (id: number): Promise<RoleEntity>;
  abstract updateById(UpdateRoleDto: UpdateRoleDto): Promise<RoleEntity>;
  abstract deleteById(id: number): Promise<boolean>;
}