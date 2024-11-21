import 'dotenv/config';
import * as Joi from 'joi';

interface EnvConfig {
  NATS_SERVERS: string[];
  DATABASE_URL_POSTGRES: string;
}

const envSchema = Joi.object({
  DATABASE_URL_POSTGRES: Joi.string().required(),
}).unknown(true);

const { error, value } = envSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envConfig: EnvConfig = value;

export const envs = {
  natsServers: envConfig.NATS_SERVERS,
};
