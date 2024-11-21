import 'dotenv/config';
import * as Joi from 'joi';

interface EnvConfig {
  [key: string]: string;
  NATS_SERVERS: string;
  DATABASE_URL_MONGODB: string;
}

const envSchema = Joi.object({
  KAFKA_BROKERS: Joi.string().required().default('localhost:9092'),
  FLESPI_TOPIC: Joi.string().required(),
  FLESPI_TOKEN: Joi.string().required(),
  MQTT_HOST: Joi.string().required(),
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
  port: envConfig.PORT,
  kafkaBrokers: envConfig.KAFKA_BROKERS,
  flespiTopic: envConfig.FLESPI_TOPIC,
  mqttHost: envConfig.MQTT_HOST,
  flespiToken: envConfig.FLESPI_TOKEN,
  database_url_mongodb: envConfig.DATABASE_URL_MONGODB,
  natsServers : envConfig.NATS_SERVERS,
};
