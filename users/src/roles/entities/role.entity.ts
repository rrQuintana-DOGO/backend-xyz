import { Permission } from '@permissions/entities/permission.entity';


export class RoleHasPermission {
  public id_role_has_permission?: string;
  public id_role?: string;
  public id_permission?: string;
  public permissions?: Permission;
  public roles?: Role;
}
export class Role {
  public id_role: string;
  public name: string;
  public description: string;
  public status: boolean;
  public permissions?: string[];
  public role_has_permissions?: RoleHasPermission[];
}
