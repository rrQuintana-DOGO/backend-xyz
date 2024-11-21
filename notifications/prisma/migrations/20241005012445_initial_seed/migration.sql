CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CreateTable
CREATE TABLE "conf_event" (
    "id_conf_event" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "json_data" JSON,
    "id_event" UUID,
    "status" BOOLEAN,

    CONSTRAINT "conf_event_pkey" PRIMARY KEY ("id_conf_event")
);

-- CreateTable
CREATE TABLE "event_types" (
    "id_event_type" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(150),
    "params" JSON,
    "status" BOOLEAN,

    CONSTRAINT "event_types_pkey" PRIMARY KEY ("id_event_type")
);

-- CreateTable
CREATE TABLE "events" (
    "id_event" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "params" JSON,
    "description" VARCHAR(255),
    "status" BOOLEAN,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id_event")
);

-- CreateTable
CREATE TABLE "events_routes" (
    "id_event_route" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "description" VARCHAR(255),
    "id_event_type" UUID,
    "status" BOOLEAN,

    CONSTRAINT "events_routes_pkey" PRIMARY KEY ("id_event_route")
);

-- AddForeignKey
ALTER TABLE "conf_event" ADD CONSTRAINT "conf_event_id_event_fkey" FOREIGN KEY ("id_event") REFERENCES "events"("id_event") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events_routes" ADD CONSTRAINT "events_routes_id_event_type_fkey" FOREIGN KEY ("id_event_type") REFERENCES "event_types"("id_event_type") ON DELETE NO ACTION ON UPDATE NO ACTION;
