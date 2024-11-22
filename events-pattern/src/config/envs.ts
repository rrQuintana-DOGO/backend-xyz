import 'dotenv/config';
import * as Joi from 'joi';

interface EnvConfig {
  NATS_SERVERS: string[];
  SOCKET_URL: string;
}

const envSchema = Joi.object({
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
  natsServers: envConfig.NATS_SERVERS,
  socketUrl: envConfig.SOCKET_URL,
};
