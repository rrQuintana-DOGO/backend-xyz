import 'dotenv/config';
import * as Joi from 'joi';

interface EnvConfig {
  DATABASE_URL_POSTGRES: string;
  DATABASE_URL_MONGODB: string;
  NATS_SERVERS: string[];
  AWS_S3_REGION: string;
  AWS_ACCESS_KEY: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_S3_BUCKET: string;
  AWS_S3_URL_EXPIRES: string;
}

const envSchema = Joi.object({
  DATABASE_URL_POSTGRES: Joi.string().required(),
  DATABASE_URL_MONGODB: Joi.string().required(),
  NATS_SERVERS: Joi.array().items(Joi.string()).required(),
  AWS_S3_REGION: Joi.string().required(),
  AWS_ACCESS_KEY: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_S3_BUCKET: Joi.string().required(),
  AWS_S3_URL_EXPIRES: Joi.string().required(),
}).unknown(true);

const { error, value } = envSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS.split(',')
  }
);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envConfig: EnvConfig = value;

export const envs = {
  natsServers: envConfig.NATS_SERVERS,
  database_url_postgres: envConfig.DATABASE_URL_POSTGRES,
  database_url_mongodb: envConfig.DATABASE_URL_MONGODB,
  awsS3Region: envConfig.AWS_S3_REGION,
  awsS3Bucket: envConfig.AWS_S3_BUCKET,
  awsAccessKey: envConfig.AWS_ACCESS_KEY,
  awsSecretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY,
  awsS3UrlExpires: envConfig.AWS_S3_URL_EXPIRES
};
