import { GeoRoute } from "@app/georoutes/entities/geouroute.entity";

export class WayPoint {
  public id_waypoint: string;
  public id_georoute: string;
  public name: string;
  public description: string;
  public status: boolean;
  public georoutes: GeoRoute
  public order: number;
}