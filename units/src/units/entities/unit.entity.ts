
import { Device } from "@devices/entities/device.entity";
export class UnitHasDevices {
    public id_unit_has_device?: string;
    public id_unit?: string;
    public id_device?: string;
    public devices?: Device;
    public units?: Units;
}
/*
model unit_has_devices {
  id_unit_has_device String   @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  id_unit            String?  @db.Uuid
  id_device          String?  @db.Uuid
  devices            devices? @relation(fields: [id_device], references: [id_device], onDelete: NoAction, onUpdate: NoAction)
  units              units?   @relation(fields: [id_unit], references: [id_unit], onDelete: NoAction, onUpdate: NoAction)
}
*/ 

export class Units {
    public id_unit: string;
    public name : string;
    public model : string;
    public plate : string;
    public year : number;
    public status : boolean;
    public id_unit_type : string;
    public id_fuel_type : string;
    public unit_has_devices ?: UnitHasDevices[];
    public fuel_setpoint: string;
}