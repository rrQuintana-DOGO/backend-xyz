import { WayPoint } from "@app/waypoints/entities/waypoint.entity";

export class RouteHasWaypoints {
  id_route_has_waypoint: string;
  id_route: string;
  id_waypoint: string;
  waypoints: WayPoint;
  version: number;
}
export class Route {
  id_route: string;
  name: string;
  description: string;
  version: number;
  status: boolean;
  route_has_waypoints: RouteHasWaypoints[];
}
