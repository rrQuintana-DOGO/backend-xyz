export interface RoleEntityOptions {
  name: string;
}

export class RoleEntity {
  public name: string;

  constructor(options: RoleEntityOptions) {
    const { name } = options;
    this.name = name;
  }

  static fromObject = (object: { [key: string]: any }): RoleEntity => {
    const { name } = object;
    const role = new RoleEntity({
      name,
    });
    return role;
  };
}
