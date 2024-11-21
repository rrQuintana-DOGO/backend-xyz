import { ConfGroups } from "@confgroups/entities/conf_groups.entity";

export class Group {
    id_group: string;
    name: string;
    status: boolean;
    id_config_group: string;
    config_groups?: ConfGroups;
}