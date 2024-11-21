import { Role } from '@roles/entities/role.entity';
import { Permission } from '@permissions/entities/permission.entity';
export class UserHasPermissions {
  public id_user_has_permission?: string;
  public id_user?: string;
  public id_permission?: string;
  public permissions?: Permission;
  public users?: User;
}

export class UserHasRoles {
  public id_user_has_role?: string;
  public id_user?: string;
  public id_role?: string;
  public roles?: Role;
  public users?: User;
}

export class User {
  public id_user: string;
  public name: string;
  public id_credential: string;
  public email: string;
  public email_verified: boolean = false;
  public phone: string;
  public phone_verified: boolean = false;
  public id_time_zone: string;
  public permissions?: string[];
  public roles?: string[];
  public user_has_permissions?: UserHasPermissions[];
  public user_has_roles?: UserHasRoles[];
}
