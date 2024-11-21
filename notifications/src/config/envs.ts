import 'dotenv/config';
import * as Joi from 'joi';

interface EnvConfig {
  NATS_SERVERS: string;
  DATABASE_URL_POSTGRES: string;
  DATABASE_URL_MONGODB: string;
}

const envSchema = Joi.object({
  DATABASE_URL_POSTGRES: Joi.string().required(),
  DATABASE_URL_MONGODB: Joi.string().required(),
  NATS_SERVERS: Joi.array().items(Joi.string()).required(),
}).unknown(true);

const { error, value } = envSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS.split(',')
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envConfig: EnvConfig = value;

export const envs = {
  database_url_postgres: envConfig.DATABASE_URL_POSTGRES,
  database_url_mongodb: envConfig.DATABASE_URL_MONGODB,
  natsServers : envConfig.NATS_SERVERS,
};
