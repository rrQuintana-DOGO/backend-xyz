
import { Phase } from "@phases/entities/phase.entity";
import { TripType } from "@trip_types/entities/trip_type.entity";
import { Carrier } from "@carriers/entities/carrier.entity";
import { JourneyType } from "@journey_types/entities/journey-type.entity";
import { Route } from "@routes/entities/route.entity";
import { Client } from "@clients/entities/client.entity";
import { Driver } from "@drivers/entities/driver.entity";
import { Places } from "@places/entities/places.entity";
import { Prisma } from "@prisma/client";
import { Coords } from "@app/geofences/entities/geofence.entity";

class TripHasDrivers {
  public id_trip_has_driver: string;
  public id_trip: string;
  public id_driver: string;
  public drivers: Driver;
}

class TripHasEvents {
  public id_trip_has_event: string;
  public id_trip: string;
  public id_event: string;
}

class TripHasUnits {
  public id_has_units: string;
  public id_trip: string;
  public id_unit: string;
  public id_setpoint: string;
}

class TripHasPlaces {
  public id_trips_has_places: string;
  public id_trip: string;
  public id_place: string;
  public estimate_arrive_date: bigint;
  public real_arrive_date: bigint;
  public estimate_departure_date: bigint;
  public real_estimate_departure_date: bigint;
  public phase: number;
  public places: Places;
  public action: number;
}

export class Trip {
  public id_ext: string;
  public id_trip_type: string;
  public id_journey_type: string;
  public id_carrier: string;
  public eta: bigint;
  public id_route: string;
  public id_client: string;
  public eda: number;
  public id_phase: string;
  public id_status: string;
  public kilometers: number;
  public description: string;
  public load_size: number;
  public fuel_level_start: number;
  public fuel_level_end: number;
  public created_at: bigint;
  public deleted_at: bigint;
  public events?: string[];
  public places?: string[];
  public drivers?: string[];
  public units?: string[];
  public phases?: Phase
  public trip_types?: TripType
  public journey_types?: JourneyType
  public carriers?: Carrier
  public routes?: Route
  public clients?: Client 
  public trip_has_drivers?: TripHasDrivers[]
  public trip_has_events?: TripHasEvents[]
  public trips_has_units?: TripHasUnits[]
  public trips_has_places?: TripHasPlaces[]  
  public middle_point?: Prisma.JsonValue;

  constructor(
    id_ext: string,
    id_trip_type: string,
    id_journey_type: string,
    id_carrier: string,
    eta: bigint,
    id_route: string,
    id_client: string,
    eda: number,
    id_phase: string,
    id_status: string,
    kilometers: number,
    description: string,
    load_size: number,
    fuel_level_start: number,
    fuel_level_end: number,
    created_at: bigint,
    deleted_at: bigint,
    events?: string[],
    places?: string[],
    drivers?: string[],
    units?: string[],
    phases?: Phase,
    trip_types?: TripType,
    journey_types?: JourneyType,
    carriers?: Carrier,
    routes?: Route,
    clients?: Client,
    trip_has_drivers?: TripHasDrivers[],
    trip_has_events?: TripHasEvents[],
    trips_has_units?: TripHasUnits[],
    trips_has_places?: TripHasPlaces[],
    middle_point?: Coords
  ){
    this.id_ext = id_ext;
    this.id_trip_type = id_trip_type;
    this.id_journey_type = id_journey_type;
    this.id_carrier = id_carrier;
    this.eta = eta;
    this.id_route = id_route;
    this.id_client = id_client;
    this.eda = eda;
    this.id_phase = id_phase;
    this.id_status = id_status;
    this.kilometers = kilometers;
    this.description = description;
    this.load_size = load_size;
    this.fuel_level_start = fuel_level_start;
    this.fuel_level_end = fuel_level_end;
    this.created_at = created_at;
    this.deleted_at = deleted_at;
    this.events = events;
    this.places = places;
    this.drivers = drivers;
    this.units = units;
    this.phases = phases;
    this.trip_types = trip_types;
    this.journey_types = journey_types;
    this.carriers = carriers;
    this.routes = routes;
    this.clients = clients;
    this.trip_has_drivers = trip_has_drivers;
    this.trip_has_events = trip_has_events;
    this.trips_has_units = trips_has_units;
    this.trips_has_places = trips_has_places;
    this.middle_point = middle_point
  }
}