import { Prisma } from "@prisma/client";

export type Coords = {
  latitude: number;
  longitude: number;
};

export class GeoRoute {
  public id_georoute: string;
  public coords: Prisma.JsonValue;
  public status: boolean;


  constructor(
    id_georoute: string,
    coords: Coords,
    status: boolean,

  ) {
    this.id_georoute = id_georoute;
    this.coords = coords;
    this.status = status;

  }
}
