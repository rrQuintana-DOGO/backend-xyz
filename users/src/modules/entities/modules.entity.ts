import { Permission } from "@app/permissions/entities/permission.entity";
export class ModuleHasPermissions {
  id_module_has_permission: string;
  id_module?: string;
  id_permission?: string;
  modules?: Module;
  permissions?: Permission;
}

export class Module {
  public id_module: string;
  public name: string;
  public status: boolean;
  public permissions?: string[];
  public module_has_permissions?: any;
}
