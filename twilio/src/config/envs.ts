import 'dotenv/config';
import * as Joi from 'joi';
import { send } from 'process';

interface EnvConfig {
  SENDGRID_API_KEY: string;
  EMAIL: string;
  EMAIL_TEMPLATE_ID: string;
  NATS_SERVERS: string[];
}

const envSchema = Joi.object({
  SENDGRID_API_KEY : Joi.string().required(),
  EMAIL: Joi.string().required(),
  EMAIL_TEMPLATE_ID: Joi.string().required(),
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
  sendgridApiKey: envConfig.SENDGRID_API_KEY,
  emailTemplateId: envConfig.EMAIL_TEMPLATE_ID,
  email: envConfig.EMAIL,
  natsServers: envConfig.NATS_SERVERS,
};
