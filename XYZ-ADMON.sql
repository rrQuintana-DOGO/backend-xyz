CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS clients (
	id_client UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	id_ext VARCHAR(255),
    id_sap VARCHAR(255),
    name VARCHAR(255),
	company_name VARCHAR(255),
	address VARCHAR(255),
	rfc VARCHAR(255),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS paid_methods (
	id_paid_method UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	id_stripe_payment_methodful VARCHAR(255),
	name VARCHAR(255),
	id_client UUID,
    status BOOLEAN,

    FOREIGN KEY (id_client) REFERENCES clients(id_client)
);

CREATE TABLE IF NOT EXISTS subscription_types (
	id_subscription_type UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name VARCHAR(255),
	status BOOLEAN
);

CREATE TABLE IF NOT EXISTS subscription_tiers (
	id_subscription_tier UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name VARCHAR(255),
	price REAL,
	status BOOLEAN
);

CREATE TABLE IF NOT EXISTS subscriptions (
	id_subscription UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	id_client UUID,
	id_subscription_stripe VARCHAR(255),
    id_subscription_type UUID,
	id_subscription_tier UUID,
	start_date BIGINT,
	expire_date BIGINT,
    status BOOLEAN,

    FOREIGN KEY (id_client) REFERENCES clients(id_client),
    FOREIGN KEY (id_subscription_type) REFERENCES subscription_types(id_subscription_type),
    FOREIGN KEY (id_subscription_tier) REFERENCES subscription_tiers(id_subscription_tier)
);

CREATE TABLE IF NOT EXISTS modules (
	id_module UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name VARCHAR(255),
	cost REAL,
	status BOOLEAN
);

CREATE TABLE IF NOT EXISTS subscription_has_modules (
	id_subscription_has_module UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	id_module UUID,
	id_subscription UUID,

    FOREIGN KEY (id_module) REFERENCES modules(id_module),
    FOREIGN KEY (id_subscription) REFERENCES subscriptions(id_subscription)
);

CREATE TABLE IF NOT EXISTS invoices (
	id_invoice UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	id_client UUID,
    id_subscription UUID,
	created_at BIGINT,
	url_doc VARCHAR(255),

    FOREIGN KEY (id_client) REFERENCES clients(id_client),
    FOREIGN KEY (id_subscription) REFERENCES subscriptions(id_subscription)
);

CREATE TABLE IF NOT EXISTS client_configs (
	id_client_config UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_client UUID,
	id_platform_account INTEGER,
	platform_token VARCHAR(255),
	base_url VARCHAR(255),

    FOREIGN KEY (id_client) REFERENCES clients(id_client)
);

CREATE TABLE IF NOT EXISTS client_databases (
	id_client_database UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	id_client UUID,
	id_module UUID,
	database_token VARCHAR(255),
    status BOOLEAN,

    FOREIGN KEY (id_client) REFERENCES clients(id_client),
    FOREIGN KEY (id_module) REFERENCES modules(id_module)
);

CREATE TABLE IF NOT EXISTS credentials_xyz (
	id_credential_xyz UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	username VARCHAR(255),
	password VARCHAR(255),
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS credentials (
	id_credential UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	username VARCHAR(255),
	password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS roles (
	id_role UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name VARCHAR(255),
	status BOOLEAN
);

CREATE TABLE IF NOT EXISTS users (
	id_user UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_credential UUID,
    id_role UUID,
	name VARCHAR(255),
	email VARCHAR(255),
	status BOOLEAN,

    FOREIGN KEY (id_credential) REFERENCES credentials(id_credential),
    FOREIGN KEY (id_role) REFERENCES roles(id_role)
);

CREATE TABLE IF NOT EXISTS permissions (
	id_permission UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name VARCHAR(255),
    params JSON,
    status BOOLEAN
);

CREATE TABLE IF NOT EXISTS credentials_xyz_has_clients (
	id_credential_xyz_has_client UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	id_credential_xyz UUID,
	id_client UUID,

    FOREIGN KEY (id_credential_xyz) REFERENCES credentials_xyz(id_credential_xyz),
    FOREIGN KEY (id_client) REFERENCES clients(id_client)
);

CREATE TABLE IF NOT EXISTS user_has_permissions (
	id_user_has_permission UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	id_user UUID,
	id_permission UUID,

    FOREIGN KEY (id_user) REFERENCES users(id_credential),
    FOREIGN KEY (id_permission) REFERENCES permissions(id_permission)
);

CREATE TABLE IF NOT EXISTS role_has_permissions (
	id_role_has_permission UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	id_role UUID,
	id_permission UUID,

    FOREIGN KEY (id_role) REFERENCES roles(id_role),
    FOREIGN KEY (id_permission) REFERENCES permissions(id_permission)
);

