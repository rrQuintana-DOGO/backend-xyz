import { Prisma } from "@prisma/client";

export type Coords = {
  latitude: number;
  longitude: number;
};

export class Geofence {
  public id_geofence: string;
  public coords: Prisma.JsonValue;
  public status: boolean;
  public name: string;
  public id_geofence_type: string;

  constructor(
    id_geofence: string,
    coords: Coords,
    status: boolean,
    name: string,
    id_geofence_type: string
  ) {
    this.id_geofence = id_geofence;
    this.coords = coords; 
    this.status = status;
    this.name = name;
    this.id_geofence_type = id_geofence_type;
  }
}
