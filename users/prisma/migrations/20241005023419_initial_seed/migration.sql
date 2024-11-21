CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "credentials" (
    "id_credential" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "username" VARCHAR(50),
    "password" VARCHAR(255),

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id_credential")
);

-- CreateTable
CREATE TABLE "module_has_permissions" (
    "id_module_has_permission" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_module" UUID,
    "id_permission" UUID,

    CONSTRAINT "module_has_permissions_pkey" PRIMARY KEY ("id_module_has_permission")
);

-- CreateTable
CREATE TABLE "modules" (
    "id_module" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "status" BOOLEAN,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id_module")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id_permission" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "params" JSON,
    "status" BOOLEAN,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id_permission")
);

-- CreateTable
CREATE TABLE "role_has_permissions" (
    "id_role_has_permission" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_role" UUID,
    "id_permission" UUID,

    CONSTRAINT "role_has_permissions_pkey" PRIMARY KEY ("id_role_has_permission")
);

-- CreateTable
CREATE TABLE "roles" (
    "id_role" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "description" VARCHAR(255),
    "status" BOOLEAN,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_role")
);

-- CreateTable
CREATE TABLE "time_zones" (
    "id_time_zone" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "off_set" REAL,
    "status" BOOLEAN,

    CONSTRAINT "time_zones_pkey" PRIMARY KEY ("id_time_zone")
);

-- CreateTable
CREATE TABLE "user_has_permissions" (
    "id_user_has_permission" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_user" UUID,
    "id_permission" UUID,

    CONSTRAINT "user_has_permissions_pkey" PRIMARY KEY ("id_user_has_permission")
);

-- CreateTable
CREATE TABLE "user_has_roles" (
    "id_user_has_role" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_user" UUID,
    "id_role" UUID,

    CONSTRAINT "user_has_roles_pkey" PRIMARY KEY ("id_user_has_role")
);

-- CreateTable
CREATE TABLE "users" (
    "id_user" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50),
    "email" VARCHAR(150),
    "email_verified" BOOLEAN,
    "phone" VARCHAR(50),
    "phone_verified" BOOLEAN,
    "id_credential" UUID,
    "id_time_zone" UUID,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id_user")
);

-- AddForeignKey
ALTER TABLE "module_has_permissions" ADD CONSTRAINT "module_has_permissions_id_module_fkey" FOREIGN KEY ("id_module") REFERENCES "modules"("id_module") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "module_has_permissions" ADD CONSTRAINT "module_has_permissions_id_permission_fkey" FOREIGN KEY ("id_permission") REFERENCES "permissions"("id_permission") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_has_permissions" ADD CONSTRAINT "role_has_permissions_id_permission_fkey" FOREIGN KEY ("id_permission") REFERENCES "permissions"("id_permission") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_has_permissions" ADD CONSTRAINT "role_has_permissions_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "roles"("id_role") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_has_permissions" ADD CONSTRAINT "user_has_permissions_id_permission_fkey" FOREIGN KEY ("id_permission") REFERENCES "permissions"("id_permission") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_has_permissions" ADD CONSTRAINT "user_has_permissions_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_has_roles" ADD CONSTRAINT "user_has_roles_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "roles"("id_role") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_has_roles" ADD CONSTRAINT "user_has_roles_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_id_credential_fkey" FOREIGN KEY ("id_credential") REFERENCES "credentials"("id_credential") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_id_time_zone_fkey" FOREIGN KEY ("id_time_zone") REFERENCES "time_zones"("id_time_zone") ON DELETE NO ACTION ON UPDATE NO ACTION;
