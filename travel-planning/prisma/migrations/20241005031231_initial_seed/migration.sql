CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "carrier_has_contacts" (
    "id_carrier_has_contact" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_contact" UUID,
    "id_carrier" UUID,

    CONSTRAINT "carrier_has_contacts_pkey" PRIMARY KEY ("id_carrier_has_contact")
);

-- CreateTable
CREATE TABLE "carrier_has_drivers" (
    "id_carrier_has_driver" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_carrier" UUID,
    "id_driver" UUID,

    CONSTRAINT "carrier_has_drivers_pkey" PRIMARY KEY ("id_carrier_has_driver")
);

-- CreateTable
CREATE TABLE "carrier_has_units" (
    "id_carrier_has_unit" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_unit" UUID,
    "id_carrier" UUID,

    CONSTRAINT "carrier_has_units_pkey" PRIMARY KEY ("id_carrier_has_unit")
);

-- CreateTable
CREATE TABLE "carriers" (
    "id_carrier" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "phone" VARCHAR(50),
    "email" VARCHAR(50),
    "address" VARCHAR(255),
    "status" BOOLEAN,

    CONSTRAINT "carriers_pkey" PRIMARY KEY ("id_carrier")
);

-- CreateTable
CREATE TABLE "clients" (
    "id_client" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "company_name" VARCHAR(50),
    "address" VARCHAR(255),
    "status" BOOLEAN,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id_client")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id_contact" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "email" VARCHAR(50),
    "phone" VARCHAR(50),
    "address" VARCHAR(255),
    "role" VARCHAR(50),
    "status" BOOLEAN,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id_contact")
);

-- CreateTable
CREATE TABLE "drivers" (
    "id_driver" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "phone" VARCHAR(50),
    "email" VARCHAR(150),
    "rc_code" VARCHAR(50),
    "license_expiration" DATE,
    "license_type_id" UUID,
    "status" BOOLEAN,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id_driver")
);

-- CreateTable
CREATE TABLE "geofences" (
    "id_geofence" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255),
    "id_geofence_type" UUID,
    "coords" JSON,
    "status" BOOLEAN,

    CONSTRAINT "geofences_pkey" PRIMARY KEY ("id_geofence")
);

-- CreateTable
CREATE TABLE "georoutes" (
    "id_georoute" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "coords" JSON,
    "status" BOOLEAN,

    CONSTRAINT "georoutes_pkey" PRIMARY KEY ("id_georoute")
);

-- CreateTable
CREATE TABLE "journey_types" (
    "id_journey_type" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "description" VARCHAR(255),
    "status" BOOLEAN,

    CONSTRAINT "journey_types_pkey" PRIMARY KEY ("id_journey_type")
);

-- CreateTable
CREATE TABLE "license_types" (
    "id_license_type" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255),
    "status" BOOLEAN,

    CONSTRAINT "license_types_pkey" PRIMARY KEY ("id_license_type")
);

-- CreateTable
CREATE TABLE "phases" (
    "id_phase" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "status" BOOLEAN,

    CONSTRAINT "phases_pkey" PRIMARY KEY ("id_phase")
);

-- CreateTable
CREATE TABLE "place_has_contacts" (
    "id_place_has_contact" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_place" UUID,
    "id_contact" UUID,

    CONSTRAINT "place_has_contacts_pkey" PRIMARY KEY ("id_place_has_contact")
);

-- CreateTable
CREATE TABLE "place_types" (
    "id_place_type" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "status" BOOLEAN,

    CONSTRAINT "place_types_pkey" PRIMARY KEY ("id_place_type")
);

-- CreateTable
CREATE TABLE "places" (
    "id_place" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_place_type" UUID,
    "id_geofence" UUID,
    "name" VARCHAR(50),
    "location" VARCHAR(50),
    "address" VARCHAR(255),
    "status" BOOLEAN,

    CONSTRAINT "places_pkey" PRIMARY KEY ("id_place")
);

-- CreateTable
CREATE TABLE "route_has_event_routes" (
    "id_route_has_event_route" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_event_route" UUID,
    "id_route" UUID,
    "event_count" INTEGER,
    "version" INTEGER,

    CONSTRAINT "route_has_event_routes_pkey" PRIMARY KEY ("id_route_has_event_route")
);

-- CreateTable
CREATE TABLE "route_has_stops" (
    "id_route_has_stop" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_route" UUID,
    "id_stop" UUID,
    "departure_date" BIGINT,
    "arrival_date" BIGINT,
    "version" INTEGER,

    CONSTRAINT "route_has_stops_pkey" PRIMARY KEY ("id_route_has_stop")
);

-- CreateTable
CREATE TABLE "route_has_waypoints" (
    "id_route_has_waypoint" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_route" UUID,
    "id_waypoint" UUID,
    "version" INTEGER,

    CONSTRAINT "route_has_waypoints_pkey" PRIMARY KEY ("id_route_has_waypoint")
);

-- CreateTable
CREATE TABLE "routes" (
    "id_route" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "description" VARCHAR(50),
    "version" INTEGER,
    "status" BOOLEAN,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id_route")
);

-- CreateTable
CREATE TABLE "situations" (
    "id_situation" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255),
    "status" BOOLEAN,

    CONSTRAINT "situations_pkey" PRIMARY KEY ("id_situation")
);

-- CreateTable
CREATE TABLE "status" (
    "id_status" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "status" BOOLEAN,

    CONSTRAINT "status_pkey" PRIMARY KEY ("id_status")
);

-- CreateTable
CREATE TABLE "stop_types" (
    "id_stop_type" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "status" BOOLEAN,

    CONSTRAINT "stop_types_pkey" PRIMARY KEY ("id_stop_type")
);

-- CreateTable
CREATE TABLE "stops" (
    "id_stop" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_geofence" UUID,
    "name" VARCHAR(50),
    "address" VARCHAR(255),
    "status" BOOLEAN,
    "id_stop_type" UUID,

    CONSTRAINT "stops_pkey" PRIMARY KEY ("id_stop")
);

-- CreateTable
CREATE TABLE "trip_has_drivers" (
    "id_trip_has_driver" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_driver" UUID,
    "id_trip" UUID,

    CONSTRAINT "trip_has_drivers_pkey" PRIMARY KEY ("id_trip_has_driver")
);

-- CreateTable
CREATE TABLE "trip_has_events" (
    "id_trip_has_event" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_trip" UUID,
    "id_event" UUID,

    CONSTRAINT "trip_has_events_pkey" PRIMARY KEY ("id_trip_has_event")
);

-- CreateTable
CREATE TABLE "trip_types" (
    "id_trip_type" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "description" VARCHAR(255),
    "status" BOOLEAN,

    CONSTRAINT "trip_types_pkey" PRIMARY KEY ("id_trip_type")
);

-- CreateTable
CREATE TABLE "trips" (
    "id_trip" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_ext" VARCHAR(50),
    "id_trip_type" UUID,
    "id_journey_type" UUID,
    "id_carrier" UUID,
    "eta" BIGINT,
    "id_route" UUID,
    "id_client" UUID,
    "eda" INTEGER,
    "id_phase" UUID,
    "id_status" UUID,
    "kilometers" REAL,
    "description" VARCHAR(255),
    "load_size" REAL,
    "fuel_level_start" REAL,
    "fuel_level_end" REAL,
    "created_at" BIGINT,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id_trip")
);

-- CreateTable
CREATE TABLE "trips_has_places" (
    "id_trips_has_places" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_trip" UUID,
    "id_place" UUID,
    "estimate_arrive_date" BIGINT,
    "real_arrive_date" BIGINT,
    "estimate_departure_date" BIGINT,
    "real_estimate_departure_date" BIGINT,
    "phase" INTEGER,

    CONSTRAINT "trips_has_places_pkey" PRIMARY KEY ("id_trips_has_places")
);

-- CreateTable
CREATE TABLE "trips_has_units" (
    "id_has_units" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_trip" UUID,
    "id_unit" UUID,
    "id_setpoint" UUID,

    CONSTRAINT "trips_has_units_pkey" PRIMARY KEY ("id_has_units")
);

-- CreateTable
CREATE TABLE "waypoints" (
    "id_waypoint" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_georoute" UUID,
    "name" VARCHAR(50),
    "description" VARCHAR(255),
    "status" BOOLEAN,

    CONSTRAINT "waypoints_pkey" PRIMARY KEY ("id_waypoint")
);

-- CreateTable
CREATE TABLE "geofence_types" (
    "id_geofence_type" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "status" BOOLEAN,

    CONSTRAINT "geofence_types_pkey" PRIMARY KEY ("id_geofence_type")
);

-- CreateIndex
CREATE UNIQUE INDEX "route_has_stops_id_stop_key" ON "route_has_stops"("id_stop");

-- CreateIndex
CREATE UNIQUE INDEX "trips_id_ext_key" ON "trips"("id_ext");

-- AddForeignKey
ALTER TABLE "carrier_has_contacts" ADD CONSTRAINT "carrier_has_contacts_id_carrier_fkey" FOREIGN KEY ("id_carrier") REFERENCES "carriers"("id_carrier") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "carrier_has_contacts" ADD CONSTRAINT "carrier_has_contacts_id_contact_fkey" FOREIGN KEY ("id_contact") REFERENCES "contacts"("id_contact") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "carrier_has_drivers" ADD CONSTRAINT "carrier_has_drivers_id_carrier_fkey" FOREIGN KEY ("id_carrier") REFERENCES "carriers"("id_carrier") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "carrier_has_drivers" ADD CONSTRAINT "carrier_has_drivers_id_driver_fkey" FOREIGN KEY ("id_driver") REFERENCES "drivers"("id_driver") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "carrier_has_units" ADD CONSTRAINT "carrier_has_units_id_carrier_fkey" FOREIGN KEY ("id_carrier") REFERENCES "carriers"("id_carrier") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_license_type_id_fkey" FOREIGN KEY ("license_type_id") REFERENCES "license_types"("id_license_type") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "geofences" ADD CONSTRAINT "geofences_id_geofence_type_fkey" FOREIGN KEY ("id_geofence_type") REFERENCES "geofence_types"("id_geofence_type") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "place_has_contacts" ADD CONSTRAINT "place_has_contacts_id_contact_fkey" FOREIGN KEY ("id_contact") REFERENCES "contacts"("id_contact") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "place_has_contacts" ADD CONSTRAINT "place_has_contacts_id_place_fkey" FOREIGN KEY ("id_place") REFERENCES "places"("id_place") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_id_geofence_fkey" FOREIGN KEY ("id_geofence") REFERENCES "geofences"("id_geofence") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_id_place_type_fkey" FOREIGN KEY ("id_place_type") REFERENCES "place_types"("id_place_type") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "route_has_event_routes" ADD CONSTRAINT "route_has_event_routes_id_route_fkey" FOREIGN KEY ("id_route") REFERENCES "routes"("id_route") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "route_has_stops" ADD CONSTRAINT "route_has_stops_id_route_fkey" FOREIGN KEY ("id_route") REFERENCES "routes"("id_route") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "route_has_stops" ADD CONSTRAINT "route_has_stops_id_stop_fkey" FOREIGN KEY ("id_stop") REFERENCES "stops"("id_stop") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "route_has_waypoints" ADD CONSTRAINT "route_has_waypoints_id_route_fkey" FOREIGN KEY ("id_route") REFERENCES "routes"("id_route") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "route_has_waypoints" ADD CONSTRAINT "route_has_waypoints_id_waypoint_fkey" FOREIGN KEY ("id_waypoint") REFERENCES "waypoints"("id_waypoint") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stops" ADD CONSTRAINT "stops_id_geofence_fkey" FOREIGN KEY ("id_geofence") REFERENCES "geofences"("id_geofence") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stops" ADD CONSTRAINT "stops_id_stop_type_fkey" FOREIGN KEY ("id_stop_type") REFERENCES "stop_types"("id_stop_type") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trip_has_drivers" ADD CONSTRAINT "trip_has_drivers_id_driver_fkey" FOREIGN KEY ("id_driver") REFERENCES "drivers"("id_driver") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trip_has_drivers" ADD CONSTRAINT "trip_has_drivers_id_trip_fkey" FOREIGN KEY ("id_trip") REFERENCES "trips"("id_trip") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trip_has_events" ADD CONSTRAINT "trip_has_events_id_trip_fkey" FOREIGN KEY ("id_trip") REFERENCES "trips"("id_trip") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_id_carrier_fkey" FOREIGN KEY ("id_carrier") REFERENCES "carriers"("id_carrier") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "clients"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_id_journey_type_fkey" FOREIGN KEY ("id_journey_type") REFERENCES "journey_types"("id_journey_type") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_id_phase_fkey" FOREIGN KEY ("id_phase") REFERENCES "phases"("id_phase") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_id_route_fkey" FOREIGN KEY ("id_route") REFERENCES "routes"("id_route") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_id_status_fkey" FOREIGN KEY ("id_status") REFERENCES "status"("id_status") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_id_trip_type_fkey" FOREIGN KEY ("id_trip_type") REFERENCES "trip_types"("id_trip_type") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips_has_places" ADD CONSTRAINT "trips_has_places_id_place_fkey" FOREIGN KEY ("id_place") REFERENCES "places"("id_place") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips_has_places" ADD CONSTRAINT "trips_has_places_id_trip_fkey" FOREIGN KEY ("id_trip") REFERENCES "trips"("id_trip") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips_has_units" ADD CONSTRAINT "trips_has_units_id_trip_fkey" FOREIGN KEY ("id_trip") REFERENCES "trips"("id_trip") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "waypoints" ADD CONSTRAINT "waypoints_id_georoute_fkey" FOREIGN KEY ("id_georoute") REFERENCES "georoutes"("id_georoute") ON DELETE NO ACTION ON UPDATE NO ACTION;
