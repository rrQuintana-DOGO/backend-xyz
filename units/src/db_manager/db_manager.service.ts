import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Client } from 'pg';
import mongoose, { Connection } from 'mongoose';
import * as Models from '@app/mongoose';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { CreateDatabaseDto } from './dto/create-database';

@Injectable()
export class DataBaseManagerService implements OnModuleInit {
  private readonly logger = new Logger(DataBaseManagerService.name);
  private pgClient: Client;
  private postgres_connections: Map<string, PrismaClient> = new Map();
  private mongo_connections: Map<string, Connection> = new Map();

  constructor() {
    this.pgClient = new Client({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: 'postgres',
      password: process.env.POSTGRES_PASSWORD,
      port: parseInt(process.env.POSTGRES_PORT, 10),
    });
  }

  async onModuleInit() {
    this.logger.log('DbManager Alerts Service Connected to the database');
    await this.pgClient.connect();
    mongoose.disconnect();
  }

  async getPostgresConnection(clientDbName: string): Promise<PrismaClient> {
    if (this.postgres_connections.has(clientDbName)) {
      return this.postgres_connections.get(clientDbName);
    }

    try {
      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${clientDbName}`,
          },
        },
      });

      await prisma.$connect();
      this.postgres_connections.set(clientDbName, prisma);
      return prisma;
    } catch (error) {
      console.error(`Error connecting to database ${clientDbName}:`, error);
      throw new Error(`Could not connect to the database: ${error.message}`);
    }
  }

  async getMongoConnection(databaseName: string): Promise<Connection> {
    if (this.mongo_connections.has(databaseName)) {
      return this.mongo_connections.get(databaseName);
    }

    const mongoUri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${databaseName}`;

    try {
      const connection = mongoose.createConnection(mongoUri);

      connection.on('error', (err) => {
        this.logger.error(`Connection error for database ${databaseName}:`, err);
      });

      connection.once('open', () => {
        this.logger.log(`Connected to database ${databaseName}`);
      });

      this.mongo_connections.set(databaseName, connection);
      return connection;
    } catch (error) {
      this.logger.error(`Error connecting to MongoDB database ${databaseName}:`, error);
      throw new Error(`Could not connect to MongoDB: ${error.message}`);
    }
  }

  async create(createDatabaseDto: CreateDatabaseDto) {
    const { name: dbName } = createDatabaseDto;
    const mongoUrl = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${dbName}`;

    try {
      await this.pgClient.query(`CREATE DATABASE ${dbName};`);
      this.logger.log(`PostgreSQL database ${dbName} created successfully.`);

      process.env.DATABASE_URL_POSTGRES = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${dbName}`;
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      this.logger.log(`Prisma migrations applied to ${dbName}.`);

      await mongoose.connect(mongoUrl);
      this.logger.log(`MongoDB database ${dbName} created successfully.`);

      for (const modelName in Models) {
        const model = Models[modelName];
        if (model && typeof model.createCollection === 'function') {
          await model.createCollection();
          this.logger.log(`MongoDB collection ${model.collection.collectionName} created.`);
        }
      }

      await mongoose.disconnect();

      return {
        message: `Databases created: PostgreSQL: ${dbName}, MongoDB: ${dbName}`,
        status: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error(`Error occurred: ${error.message}`);

      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.dropDatabase();
        this.logger.log(`MongoDB database ${dbName} dropped due to error.`);
      }

      await this.pgClient.query(`DROP DATABASE IF EXISTS ${dbName};`);
      this.logger.log(`PostgreSQL database ${dbName} dropped due to error.`);

      throw new RpcException({
        message: 'Error creating databases, rollback performed',
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      });
    }
  }
}