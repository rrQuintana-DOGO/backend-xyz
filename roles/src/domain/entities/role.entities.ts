export class RoleEntity {
  constructor(public id: number, public name: string) {}

  static fromObject = (object: { [key: string]: any }): RoleEntity => {
    const { id, name } = object;

    if (!id) throw "Id is required";
    if (!name) throw "Name is required";

    return new RoleEntity(id, name);
  };
}
