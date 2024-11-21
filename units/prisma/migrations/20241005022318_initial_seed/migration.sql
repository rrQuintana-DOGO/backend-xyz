CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "config_groups" (
    "id_config_group" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "parameters" JSON,
    "status" BOOLEAN,

    CONSTRAINT "config_groups_pkey" PRIMARY KEY ("id_config_group")
);

-- CreateTable
CREATE TABLE "device_has_groups" (
    "id_device_has_group" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_device" UUID,
    "id_group" UUID,

    CONSTRAINT "device_has_groups_pkey" PRIMARY KEY ("id_device_has_group")
);

-- CreateTable
CREATE TABLE "device_types" (
    "id_device_type" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "status" BOOLEAN,

    CONSTRAINT "device_types_pkey" PRIMARY KEY ("id_device_type")
);

-- CreateTable
CREATE TABLE "devices" (
    "id_device" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_device_type" UUID,
    "imei" VARCHAR(50),
    "name" VARCHAR(50),
    "id_ext" VARCHAR(50),
    "status" BOOLEAN,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id_device")
);

-- CreateTable
CREATE TABLE "fuel_consumptions" (
    "id_fuel_consumption" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_unit" UUID,
    "id_trip" UUID,
    "date" BIGINT,
    "fuel_level" REAL,
    "distance_traveled" REAL,
    "load_level" REAL,

    CONSTRAINT "fuel_consumptions_pkey" PRIMARY KEY ("id_fuel_consumption")
);

-- CreateTable
CREATE TABLE "fuel_setpoints" (
    "id_fuel_setpoint" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "setpoint" REAL,
    "minimum_range" REAL,
    "periodic_alert" TIME(6),
    "id_unit_measure" UUID,
    "status" BOOLEAN,

    CONSTRAINT "fuel_setpoints_pkey" PRIMARY KEY ("id_fuel_setpoint")
);

-- CreateTable
CREATE TABLE "fuel_types" (
    "id_fuel_type" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255),
    "id_unit_measurement" UUID,
    "status" BOOLEAN,

    CONSTRAINT "fuel_types_pkey" PRIMARY KEY ("id_fuel_type")
);

-- CreateTable
CREATE TABLE "groups" (
    "id_group" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255),
    "status" BOOLEAN,
    "id_config_group" UUID,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id_group")
);

-- CreateTable
CREATE TABLE "maintenance_category" (
    "id_maintenance_category" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "status" BOOLEAN,

    CONSTRAINT "maintenance_category_pkey" PRIMARY KEY ("id_maintenance_category")
);

-- CreateTable
CREATE TABLE "maintenance_category_has_tasks" (
    "id_maintenance_category_has_task" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_maintenance_category" UUID,
    "id_maintenance_task" UUID,

    CONSTRAINT "maintenance_category_has_tasks_pkey" PRIMARY KEY ("id_maintenance_category_has_task")
);

-- CreateTable
CREATE TABLE "maintenance_details" (
    "id_maintenance_detail" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_maintenance" UUID,
    "id_maintenance_category" UUID,
    "id_maintenance_task" UUID,
    "quantity" INTEGER,
    "cost" DOUBLE PRECISION,

    CONSTRAINT "maintenance_details_pkey" PRIMARY KEY ("id_maintenance_detail")
);

-- CreateTable
CREATE TABLE "maintenance_has_events" (
    "id_maintenance_event" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_event" UUID,
    "id_maintenance" UUID,

    CONSTRAINT "maintenance_has_events_pkey" PRIMARY KEY ("id_maintenance_event")
);

-- CreateTable
CREATE TABLE "maintenance_tasks" (
    "id_maintenance_task" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255),
    "status" BOOLEAN,

    CONSTRAINT "maintenance_tasks_pkey" PRIMARY KEY ("id_maintenance_task")
);

-- CreateTable
CREATE TABLE "maintenance_types" (
    "id_maintenance_type" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255),
    "status" BOOLEAN,

    CONSTRAINT "maintenance_types_pkey" PRIMARY KEY ("id_maintenance_type")
);

-- CreateTable
CREATE TABLE "maintenances" (
    "id_maintenance" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "description" VARCHAR(255),
    "schedule_date" BIGINT,
    "start_date" BIGINT,
    "end_date" BIGINT,
    "release_date" BIGINT,
    "reference" VARCHAR(255),
    "labor_cost" REAL,
    "status" BOOLEAN,
    "id_supplier" UUID,
    "id_unit" UUID,
    "id_maintenance_type" UUID,
    "id_event" UUID,
    "id_user" UUID,

    CONSTRAINT "maintenances_pkey" PRIMARY KEY ("id_maintenance")
);

-- CreateTable
CREATE TABLE "setpoints" (
    "id_setpoint" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(150),
    "optimus_temp" REAL,
    "minimum_range" REAL,
    "maximum_range" REAL,
    "id_unit_measurement" UUID,
    "status" BOOLEAN,

    CONSTRAINT "setpoints_pkey" PRIMARY KEY ("id_setpoint")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id_supplier" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255),
    "type" VARCHAR(255),
    "address" VARCHAR(255),
    "cp" VARCHAR(255),
    "city" VARCHAR(255),
    "country" VARCHAR(255),
    "status" BOOLEAN,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id_supplier")
);

-- CreateTable
CREATE TABLE "unit_has_devices" (
    "id_unit_has_device" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_unit" UUID,
    "id_device" UUID,

    CONSTRAINT "unit_has_devices_pkey" PRIMARY KEY ("id_unit_has_device")
);

-- CreateTable
CREATE TABLE "unit_has_fuel_setpoint" (
    "id_unit_has_fuel_setpoint" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_fuel_setpoint" UUID,
    "id_unit" UUID,

    CONSTRAINT "unit_has_fuel_setpoint_pkey" PRIMARY KEY ("id_unit_has_fuel_setpoint")
);

-- CreateTable
CREATE TABLE "unit_types" (
    "id_unit_type" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "optimal_fuel_performance" REAL,
    "status" BOOLEAN,

    CONSTRAINT "unit_types_pkey" PRIMARY KEY ("id_unit_type")
);

-- CreateTable
CREATE TABLE "units" (
    "id_unit" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "model" VARCHAR(50),
    "plate" VARCHAR(50),
    "year" INTEGER,
    "status" BOOLEAN,
    "id_unit_type" UUID,
    "id_fuel_type" UUID,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id_unit")
);

-- CreateTable
CREATE TABLE "unit_measurements" (
    "id_unit_measurement" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "symbol" VARCHAR(50),
    "conversion" JSON,
    "status" BOOLEAN,

    CONSTRAINT "unit_measurements_pkey" PRIMARY KEY ("id_unit_measurement")
);

-- CreateIndex
CREATE UNIQUE INDEX "devices_imei_key" ON "devices"("imei");

-- CreateIndex
CREATE UNIQUE INDEX "devices_id_ext_key" ON "devices"("id_ext");

-- AddForeignKey
ALTER TABLE "device_has_groups" ADD CONSTRAINT "device_has_groups_id_device_fkey" FOREIGN KEY ("id_device") REFERENCES "devices"("id_device") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "device_has_groups" ADD CONSTRAINT "device_has_groups_id_group_fkey" FOREIGN KEY ("id_group") REFERENCES "groups"("id_group") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_id_device_type_fkey" FOREIGN KEY ("id_device_type") REFERENCES "device_types"("id_device_type") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fuel_consumptions" ADD CONSTRAINT "fuel_consumptions_id_unit_fkey" FOREIGN KEY ("id_unit") REFERENCES "units"("id_unit") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fuel_setpoints" ADD CONSTRAINT "fuel_setpoints_id_unit_measure_fkey" FOREIGN KEY ("id_unit_measure") REFERENCES "unit_measurements"("id_unit_measurement") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fuel_types" ADD CONSTRAINT "fuel_types_id_unit_measurement_fkey" FOREIGN KEY ("id_unit_measurement") REFERENCES "unit_measurements"("id_unit_measurement") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_id_config_group_fkey" FOREIGN KEY ("id_config_group") REFERENCES "config_groups"("id_config_group") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "maintenance_category_has_tasks" ADD CONSTRAINT "maintenance_category_has_tasks_id_maintenance_category_fkey" FOREIGN KEY ("id_maintenance_category") REFERENCES "maintenance_category"("id_maintenance_category") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "maintenance_category_has_tasks" ADD CONSTRAINT "maintenance_category_has_tasks_id_maintenance_task_fkey" FOREIGN KEY ("id_maintenance_task") REFERENCES "maintenance_tasks"("id_maintenance_task") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "maintenance_details" ADD CONSTRAINT "maintenance_details_id_maintenance_category_fkey" FOREIGN KEY ("id_maintenance_category") REFERENCES "maintenance_category"("id_maintenance_category") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "maintenance_details" ADD CONSTRAINT "maintenance_details_id_maintenance_fkey" FOREIGN KEY ("id_maintenance") REFERENCES "maintenances"("id_maintenance") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "maintenance_details" ADD CONSTRAINT "maintenance_details_id_maintenance_task_fkey" FOREIGN KEY ("id_maintenance_task") REFERENCES "maintenance_tasks"("id_maintenance_task") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "maintenance_has_events" ADD CONSTRAINT "maintenance_has_events_id_maintenance_fkey" FOREIGN KEY ("id_maintenance") REFERENCES "maintenances"("id_maintenance") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_id_maintenance_type_fkey" FOREIGN KEY ("id_maintenance_type") REFERENCES "maintenance_types"("id_maintenance_type") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_id_supplier_fkey" FOREIGN KEY ("id_supplier") REFERENCES "suppliers"("id_supplier") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_id_unit_fkey" FOREIGN KEY ("id_unit") REFERENCES "units"("id_unit") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "setpoints" ADD CONSTRAINT "setpoints_id_unit_measurement_fkey" FOREIGN KEY ("id_unit_measurement") REFERENCES "unit_measurements"("id_unit_measurement") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit_has_devices" ADD CONSTRAINT "unit_has_devices_id_device_fkey" FOREIGN KEY ("id_device") REFERENCES "devices"("id_device") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit_has_devices" ADD CONSTRAINT "unit_has_devices_id_unit_fkey" FOREIGN KEY ("id_unit") REFERENCES "units"("id_unit") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit_has_fuel_setpoint" ADD CONSTRAINT "unit_has_fuel_setpoint_id_fuel_setpoint_fkey" FOREIGN KEY ("id_fuel_setpoint") REFERENCES "fuel_setpoints"("id_fuel_setpoint") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "unit_has_fuel_setpoint" ADD CONSTRAINT "unit_has_fuel_setpoint_id_unit_fkey" FOREIGN KEY ("id_unit") REFERENCES "units"("id_unit") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_id_fuel_type_fkey" FOREIGN KEY ("id_fuel_type") REFERENCES "fuel_types"("id_fuel_type") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_id_unit_type_fkey" FOREIGN KEY ("id_unit_type") REFERENCES "unit_types"("id_unit_type") ON DELETE NO ACTION ON UPDATE NO ACTION;
