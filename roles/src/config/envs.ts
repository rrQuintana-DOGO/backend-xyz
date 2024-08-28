import 'dotenv/config';
import * as Joi from 'joi';

interface EnvConfig {
  [key: string]: string;
}

const envSchema = Joi.object({
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
}).unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envConfig: EnvConfig = value;

export const envs = {
  port: parseInt(envConfig.PORT, 10),
};
