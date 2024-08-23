export class UpdateRoleDto {

    private constructor(
        public readonly id: string,
        public readonly name: string
    ){}

    get values() {
        const returnObj : { [key: string]: any } = {};

        if (this.name) returnObj.name = this.name;

        return returnObj;
    }

    static create (props: { [key: string]: any }): [string?, UpdateRoleDto?] {
        const { id, name } = props;

        if( !id || isNaN( Number(id))) {
            return ["id must be a valid number"];
        }

        return [undefined, new UpdateRoleDto(id, name)];
    }
}