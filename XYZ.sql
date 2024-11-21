CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS phases (
    id_phase UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS status (
    id_status UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS maintenance_types (
    id_maintenance_type UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS suppliers (
    id_supplier UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    type VARCHAR(255),
    address VARCHAR(255),
    cp VARCHAR(255),
    city VARCHAR(255),
    country VARCHAR(255),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS config_groups (
    id_config_group UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parameters JSON,
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS groups (
    id_group UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    status BOOLEAN,
    id_config_group UUID,

    FOREIGN KEY (id_config_group) REFERENCES config_groups(id_config_group)
);

CREATE TABLE IF NOT EXISTS situations (
    id_situation UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS time_zones (
    id_time_zone UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    off_set REAL,
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS credentials (
    id_credential UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50),
    password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
    id_user UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    email VARCHAR(150),
    email_verified BOOLEAN,
    phone VARCHAR(50),
    phone_verified BOOLEAN,
    id_credential UUID,
    id_time_zone UUID,

    FOREIGN KEY (id_credential) REFERENCES credentials(id_credential),
    FOREIGN KEY (id_time_zone) REFERENCES time_zones(id_time_zone)
);

CREATE TABLE IF NOT EXISTS events (
    id_event UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    params JSON,
    description VARCHAR(255),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS event_types (
    id_event_type UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150),
    params JSON,
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS stop_types (
    id_stop_type UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS license_types (
    id_license_type UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS drivers (
    id_driver UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    phone VARCHAR(50),
    email VARCHAR(150),
    rc_code VARCHAR(50),
    license_expiration DATE,
    license_type_id UUID,
    status BOOLEAN,

    FOREIGN KEY (license_type_id) REFERENCES license_types(id_license_type)
);

CREATE TABLE IF NOT EXISTS geofence_types (
    id_geofence_type UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(50),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS geofences (
    id_geofence UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(255),
    id_geofence_type UUID,
    coords JSON,
    status BOOLEAN,

    FOREIGN KEY (id_geofence_type) REFERENCES geofence_types(id_geofence_type)
);

CREATE TABLE IF NOT EXISTS stops (
    id_stop UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_geofence UUID,
    name VARCHAR(50),
    address VARCHAR(255),
    status BOOLEAN,
    id_stop_type UUID,

    FOREIGN KEY (id_geofence) REFERENCES geofences(id_geofence),
    FOREIGN KEY (id_stop_type) REFERENCES stop_types(id_stop_type)
);

CREATE TABLE IF NOT EXISTS place_types (
    id_place_type UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS device_types (
    id_device_type UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS unit_measurements (
    id_unit_measurement UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    symbol VARCHAR(50),
    conversion JSON,
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS places (
    id_place UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_place_type UUID,
    id_geofence UUID,
    name VARCHAR(50),
    location VARCHAR(50),
    address VARCHAR(255),
    status BOOLEAN,

    FOREIGN KEY (id_place_type) REFERENCES place_types(id_place_type),
    FOREIGN KEY (id_geofence) REFERENCES geofences(id_geofence)
);

CREATE TABLE IF NOT EXISTS setpoints (
    id_setpoint UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150),
    optimus_temp REAL,
    minimum_range REAL,
    maximum_range REAL,
    id_unit_measurement UUID,
    status BOOLEAN,

    FOREIGN KEY (id_unit_measurement) REFERENCES unit_measurements(id_unit_measurement)
);

CREATE TABLE IF NOT EXISTS fuel_types (
    id_fuel_type UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    id_unit_measurement UUID,
    status BOOLEAN,

    FOREIGN KEY (id_unit_measurement) REFERENCES unit_measurements(id_unit_measurement)
);

CREATE TABLE IF NOT EXISTS clients (
    id_client UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    company_name VARCHAR(50),
    address VARCHAR(255),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS trip_types (
    id_trip_type UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    description VARCHAR(255),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS journey_types (
    id_journey_type UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    description VARCHAR(255),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS carriers (
    id_carrier UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    phone VARCHAR(50),
    email VARCHAR(50),
    address VARCHAR(255),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS routes (
    id_route UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    description VARCHAR(50),
    version INTEGER,
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS unit_types (
    id_unit_type UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    optimal_fuel_performance REAL,
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS units (
    id_unit UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    model VARCHAR(50),
    plate VARCHAR(50),
    year INTEGER,
    status BOOLEAN,
    id_unit_type UUID,
    id_fuel_type UUID,

    FOREIGN KEY (id_unit_type) REFERENCES unit_types(id_unit_type),
    FOREIGN KEY (id_fuel_type)  REFERENCES fuel_types(id_fuel_type)
);

CREATE TABLE IF NOT EXISTS trips (
    id_trip UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_ext VARCHAR(50),
    id_trip_type UUID,
    id_journey_type UUID,
    id_carrier UUID,
    eta BIGINT,
    id_route UUID,
    id_client UUID,
    eda INTEGER,
    id_phase UUID,
    id_status UUID,
    kilometers REAL,
    description VARCHAR(255),
    load_size REAL,
    fuel_level_start REAL,
    fuel_level_end REAL,
    created_at BIGINT,

    FOREIGN KEY (id_trip_type) REFERENCES trip_types(id_trip_type),
    FOREIGN KEY (id_journey_type) REFERENCES journey_types(id_journey_type),
    FOREIGN KEY (id_carrier) REFERENCES carriers(id_carrier),
    FOREIGN KEY (id_route) REFERENCES routes(id_route),
    FOREIGN KEY (id_client) REFERENCES clients(id_client),
    FOREIGN KEY (id_phase) REFERENCES phases(id_phase),
    FOREIGN KEY (id_status) REFERENCES status(id_status)
);

CREATE TABLE IF NOT EXISTS trips_has_units (
    id_has_units UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_trip UUID,
    id_unit UUID,
    id_setpoint UUID,

    FOREIGN KEY (id_trip) REFERENCES trips(id_trip),
    FOREIGN KEY (id_unit) REFERENCES units(id_unit),
    FOREIGN KEY (id_setpoint) REFERENCES setpoints(id_setpoint)
);

CREATE TABLE IF NOT EXISTS devices (
    id_device UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_device_type UUID,
    imei VARCHAR(50),
    name VARCHAR(50),
    id_ext VARCHAR(50),
    status BOOLEAN,

    FOREIGN KEY (id_device_type) REFERENCES device_types(id_device_type)
);

/*
CREATE TABLE IF NOT EXISTS device_telemetry (
    id_device_telemetry UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_device UUID,
    speed INTEGER,
    temperature INTEGER,
    odometer INTEGER,
    fuel REAL,

    FOREIGN KEY (id_device) REFERENCES devices(id_device)
);
*/

CREATE TABLE IF NOT EXISTS trips_has_places (
    id_trips_has_places UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_trip UUID,
    id_place UUID,
    estimate_arrive_date BIGINT,
    real_arrive_date BIGINT,
    estimate_departure_date BIGINT,
    real_estimate_departure_date BIGINT,
    phase INTEGER,

    FOREIGN KEY (id_trip) REFERENCES trips(id_trip),
    FOREIGN KEY (id_place) REFERENCES places(id_place)
);

CREATE TABLE IF NOT EXISTS carrier_has_units (
    id_carrier_has_unit UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_unit UUID,
    id_carrier UUID,

    FOREIGN KEY (id_unit) REFERENCES units(id_unit),
    FOREIGN KEY (id_carrier)  REFERENCES carriers(id_carrier)
);

CREATE TABLE IF NOT EXISTS trip_has_drivers (
    id_trip_has_driver UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_driver UUID,
    id_trip UUID,

    FOREIGN KEY (id_driver) REFERENCES drivers(id_driver),
    FOREIGN KEY (id_trip) REFERENCES trips(id_trip)
);

CREATE TABLE IF NOT EXISTS carrier_has_drivers (
    id_carrier_has_driver UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_carrier UUID,
    id_driver UUID,

    FOREIGN KEY (id_carrier) REFERENCES carriers(id_carrier),
    FOREIGN KEY (id_driver) REFERENCES drivers(id_driver)
);

CREATE TABLE IF NOT EXISTS contacts (
    id_contact UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    email VARCHAR(50),
    phone VARCHAR(50),
    address VARCHAR(255),
    role VARCHAR(50),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS place_has_contacts (
    id_place_has_contact UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_place UUID,
    id_contact UUID,

    FOREIGN KEY (id_place) REFERENCES places(id_place),
    FOREIGN KEY (id_contact) REFERENCES contacts(id_contact)
);

CREATE TABLE IF NOT EXISTS route_has_stops (
    id_route_has_stop UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_route UUID,
    id_stop UUID UNIQUE,
    departure_date BIGINT,
    arrival_date BIGINT,
    version INTEGER,

    FOREIGN KEY (id_route) REFERENCES routes(id_route),
    FOREIGN KEY (id_stop) REFERENCES stops(id_stop)
);

CREATE TABLE IF NOT EXISTS georoutes (
    id_georoute UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coords JSON,
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS waypoints (
    id_waypoint UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_georoute UUID,
    name VARCHAR(50),
    description VARCHAR(255),
    status BOOLEAN,

    FOREIGN KEY (id_georoute) REFERENCES georoutes(id_georoute)
);

CREATE TABLE IF NOT EXISTS route_has_waypoints (
    id_route_has_waypoint UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_route UUID,
    id_waypoint UUID,
    version INTEGER,

    FOREIGN KEY (id_route) REFERENCES routes(id_route),
    FOREIGN KEY (id_waypoint) REFERENCES waypoints(id_waypoint)
);

CREATE TABLE IF NOT EXISTS events_routes (
    id_event_route UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    description VARCHAR(255),
    id_event_type UUID,
    status BOOLEAN,

    FOREIGN KEY (id_event_type) REFERENCES event_types(id_event_type)
);

CREATE TABLE IF NOT EXISTS route_has_event_routes (
    id_route_has_event_route UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_event_route UUID,
    id_route UUID,
    event_count INTEGER,
    version INTEGER,

    FOREIGN KEY (id_event_route) REFERENCES event_types(id_event_type),
    FOREIGN KEY (id_route) REFERENCES routes(id_route)
);

CREATE TABLE IF NOT EXISTS trip_has_events (
    id_trip_has_event UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_trip UUID,
    id_event UUID,

    FOREIGN KEY (id_trip) REFERENCES trips(id_trip),
    FOREIGN KEY (id_event) REFERENCES events(id_event)
);

/*
CREATE TABLE IF NOT EXISTS trip_logs (
    id_trip_log UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_trip UUID,
    id_user UUID,
    comment VARCHAR(255),
    id_status UUID,
    id_situation UUID,
    created_at BIGINT,

    FOREIGN KEY (id_trip) REFERENCES trips(id_trip),
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_status) REFERENCES status(id_status),
    FOREIGN KEY (id_situation) REFERENCES situations(id_situation)
);
*/

CREATE TABLE IF NOT EXISTS conf_event (
    id_conf_event UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    json_data JSON,
    id_event UUID,
    status BOOLEAN,

    FOREIGN KEY (id_event) REFERENCES events(id_event)
);

/*
CREATE TABLE IF NOT EXISTS notifications (
    id_notification UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_unit UUID,
    id_trip UUID,
    id_event UUID,
    id_trip_log UUID,
    register_date BIGINT,

    FOREIGN KEY (id_unit) REFERENCES units(id_unit),
    FOREIGN KEY (id_trip) REFERENCES trips(id_trip),
    FOREIGN KEY (id_event) REFERENCES events(id_event),
    FOREIGN KEY (id_trip_log) REFERENCES trip_logs(id_trip_log)
);
*/

CREATE TABLE IF NOT EXISTS device_has_groups (
    id_device_has_group UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_device UUID,
    id_group UUID,

    FOREIGN KEY (id_device) REFERENCES devices(id_device),
    FOREIGN KEY (id_group) REFERENCES groups(id_group)
);

/*
CREATE TABLE IF NOT EXISTS evidences (
    id_evidence UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description VARCHAR(255),
    url VARCHAR(255),
    related JSON
);
*/

CREATE TABLE IF NOT EXISTS maintenances (
    id_maintenance UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description VARCHAR(255),
    schedule_date BIGINT,
    start_date BIGINT,
    end_date BIGINT,
    release_date BIGINT,
    reference VARCHAR(255),
    labor_cost REAL,
    status BOOLEAN,
    id_supplier UUID,
    id_unit UUID,
    id_maintenance_type UUID,
    id_event UUID,
    id_user UUID,

    FOREIGN KEY (id_supplier) REFERENCES suppliers(id_supplier),
    FOREIGN KEY (id_unit) REFERENCES units(id_unit),
    FOREIGN KEY (id_maintenance_type) REFERENCES maintenance_types(id_maintenance_type),
    FOREIGN KEY (id_event) REFERENCES events(id_event),
    FOREIGN KEY (id_user) REFERENCES users(id_user)
);

CREATE TABLE IF NOT EXISTS maintenance_tasks (
    id_maintenance_task UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS maintenance_category (
    id_maintenance_category UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS maintenance_details (
    id_maintenance_detail UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_maintenance UUID,
    id_maintenance_category UUID,
    id_maintenance_task UUID,
    quantity INTEGER,
    cost DOUBLE PRECISION,

    FOREIGN KEY (id_maintenance) REFERENCES maintenances(id_maintenance),
    FOREIGN KEY (id_maintenance_category) REFERENCES maintenance_category(id_maintenance_category),
    FOREIGN KEY (id_maintenance_task) REFERENCES maintenance_tasks(id_maintenance_task)
);

CREATE TABLE IF NOT EXISTS maintenance_category_has_tasks (
    id_maintenance_category_has_task UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_maintenance_category UUID,
    id_maintenance_task UUID,

    FOREIGN KEY (id_maintenance_category) REFERENCES maintenance_category(id_maintenance_category),
    FOREIGN KEY (id_maintenance_task) REFERENCES maintenance_tasks(id_maintenance_task)
);

CREATE TABLE IF NOT EXISTS maintenance_has_events (
    id_maintenance_event UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_event UUID,
    id_maintenance UUID,

    FOREIGN KEY (id_event) REFERENCES events(id_event),
    FOREIGN KEY (id_maintenance) REFERENCES maintenances(id_maintenance)
);

CREATE TABLE IF NOT EXISTS roles (
    id_role UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    description VARCHAR(255),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS permissions (
    id_permission UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    params JSON,
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS role_has_permissions (
    id_role_has_permission UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_role UUID,
    id_permission UUID,

    FOREIGN KEY (id_role) REFERENCES roles(id_role),
    FOREIGN KEY (id_permission) REFERENCES permissions(id_permission)
);

CREATE TABLE IF NOT EXISTS user_has_permissions (
    id_user_has_permission UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_user UUID,
    id_permission UUID,

    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_permission) REFERENCES permissions(id_permission)
);

CREATE TABLE IF NOT EXISTS modules (
    id_module UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS module_has_permissions (
    id_module_has_permission UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_module UUID,
    id_permission UUID,

    FOREIGN KEY (id_module) REFERENCES modules(id_module),
    FOREIGN KEY (id_permission) REFERENCES permissions(id_permission)
);

CREATE TABLE IF NOT EXISTS audit (
    id_audit UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    params JSON
);

CREATE TABLE IF NOT EXISTS fuel_consumptions (
    id_fuel_consumption UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_unit UUID,
    id_trip UUID,
    date BIGINT,
    fuel_level REAL,
    distance_traveled REAL,
    load_level REAL,

    FOREIGN KEY (id_unit) REFERENCES units(id_unit),
    FOREIGN KEY (id_trip) REFERENCES trips(id_trip)
);

/*
CREATE TABLE IF NOT EXISTS fuel_changes (
    id_fuel_change UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_unit UUID,
    cost REAL,
    real_date BIGINT,
    latitude REAL,
    longitude REAL,
    fuel_charge REAL,
    type VARCHAR(255),
    register_date BIGINT,

    FOREIGN KEY (id_unit) REFERENCES units(id_unit)
);
*/

CREATE TABLE IF NOT EXISTS driver_score_weightings (
    id_driver_score_weighting UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    id_notification UUID,
    weight REAL
);

CREATE TABLE IF NOT EXISTS fuel_setpoints (
    id_fuel_setpoint UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setpoint REAL,
    minimum_range REAL,
    periodic_alert TIME,
    id_unit_measure UUID,
    status BOOLEAN,

    FOREIGN KEY (id_fuel_setpoint) REFERENCES fuel_setpoints(id_fuel_setpoint)
);

CREATE TABLE IF NOT EXISTS unit_has_fuel_setpoint (
    id_unit_has_fuel_setpoint UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_fuel_setpoint UUID,
    id_unit UUID,

    FOREIGN KEY (id_fuel_setpoint) REFERENCES fuel_setpoints(id_fuel_setpoint),
    FOREIGN KEY (id_unit) REFERENCES units(id_unit)
);

CREATE TABLE IF NOT EXISTS client_has_contacts (
    id_client_has_contact UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_client UUID,
    id_contact UUID,

    FOREIGN KEY (id_client) REFERENCES clients(id_client),
    FOREIGN KEY (id_contact) REFERENCES contacts(id_contact)
);

CREATE TABLE IF NOT EXISTS carrier_has_contacts (
    id_carrier_has_contact UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_contact UUID,
    id_carrier UUID,

    FOREIGN KEY (id_contact) REFERENCES contacts(id_contact),
    FOREIGN KEY (id_carrier) REFERENCES carriers(id_carrier)
);

CREATE TABLE IF NOT EXISTS unit_has_devices (
    id_unit_has_device UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_unit UUID,
    id_device UUID,

    FOREIGN KEY (id_unit) REFERENCES units(id_unit),
    FOREIGN KEY (id_device) REFERENCES devices(id_device)
);

CREATE TABLE IF NOT EXISTS user_has_roles (
    id_user_has_role UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_user UUID,
    id_role UUID,

    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_role) REFERENCES roles(id_role)
);