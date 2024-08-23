export class CreateRoleDto {
  private constructor(public readonly name: string) {}

  static create(props: { [key: string]: any }): [string?, CreateRoleDto?] {
    const { name } = props;

    if (!name || name.length === 0)
      return ["Name property is required", undefined];

    return [undefined, new CreateRoleDto(name)];
  }
}
