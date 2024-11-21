import { Group } from "@groups/entities/group.entity";
export class DeviceHasGroups {
    public id_device_has_group?: string;
    public id_device?: string;
    public id_group?: string;
    public devices?: Device;
    public groups?: Group;
}

export class Device {
    public id_device: string;
    public id_device_type : string;
    public imei : string;
    public name : string;
    public id_ext : string;
    public status : boolean;
    public groups?: string[];
    public device_has_groups?: DeviceHasGroups[];
}