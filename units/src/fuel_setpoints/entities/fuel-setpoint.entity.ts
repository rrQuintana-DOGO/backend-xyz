export class FuelSetpoint {
  public id_fuel_setpoint: string;
  public setpoint: number;
  public minimum_range?: number;
  public periodic_alert?: string;
  public id_unit_measure?: string;
  public status?: boolean;
}

/*
model fuel_setpoints {
  id_fuel_setpoint       String                   @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  setpoint               Float?                   @db.Real
  minimum_range          Float?                   @db.Real
  periodic_alert         DateTime?                @db.Time(6)
  id_unit_measure        String?                  @db.Uuid
  status                 Boolean?
  unit_measurements      unit_measurements?       @relation(fields: [id_unit_measure], references: [id_unit_measurement], onDelete: NoAction, onUpdate: NoAction)
  unit_has_fuel_setpoint unit_has_fuel_setpoint[]
}
*/