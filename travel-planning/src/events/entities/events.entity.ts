import { JsonValue } from "@prisma/client/runtime/library";

export class Event {
    public id_event: string;
    public name: string;
    public params: JsonValue;
    public description : string;
    public status: boolean;
}