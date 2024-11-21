import 'dotenv/config';
import * as Joi from 'joi';

interface EnvConfig {
  PORT: string;
  NATS_SERVERS: string[];
  AWS_S3_REGION: string;
  AWS_ACCESS_KEY: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_S3_BUCKET: string;
  AWS_S3_URL_EXPIRES: string;
  REACT_APP_URL: string;
  SECRET_KEY_TOKEN: string;
  CRYPT_KEY: string;
  ADMON_URL: string;
}

const envSchema = Joi.object({
  PORT: Joi.number().default(8000),
  NATS_SERVERS: Joi.array().items(Joi.string()).required(),
  AWS_S3_REGION: Joi.string().required(),
  AWS_ACCESS_KEY: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_S3_BUCKET: Joi.string().required(),
  AWS_S3_URL_EXPIRES: Joi.string().required(),
  SECRET_KEY_TOKEN: Joi.string().required(),
  CRYPT_KEY: Joi.string().required(),
  REACT_APP_URL: Joi.string().required(),
  ADMON_URL: Joi.string().required(),
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
  port: parseInt(envConfig.PORT, 10),
  natsServers: envConfig.NATS_SERVERS,
  awsS3Region: envConfig.AWS_S3_REGION,
  awsS3Bucket: envConfig.AWS_S3_BUCKET,
  awsAccessKey: envConfig.AWS_ACCESS_KEY,
  awsSecretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY,
  awsS3UrlExpires: envConfig.AWS_S3_URL_EXPIRES,
  reactAppUrl: envConfig.REACT_APP_URL,
  secretKeyToken: envConfig.SECRET_KEY_TOKEN,
  cryptKey: envConfig.CRYPT_KEY,
  admonUrl: envConfig.ADMON_URL,
};
