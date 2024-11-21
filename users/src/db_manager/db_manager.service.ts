import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Client } from 'pg';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { CreateDatabaseDto } from '@dbManager/dto/create-database';

@Injectable()
export class DataBaseManagerService implements OnModuleInit {
  private readonly logger = new Logger(DataBaseManagerService.name);
  private pgClient: Client;
  private postgres_connections: Map<string, PrismaClient> = new Map();

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
    await this.pgClient.connect();
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

  async create(createDatabaseDto: CreateDatabaseDto) {
    const { name: dbName } = createDatabaseDto;

    try {
      await this.pgClient.query(`CREATE DATABASE ${dbName};`);
      this.logger.log(`PostgreSQL database ${dbName} created successfully.`);

      process.env.DATABASE_URL_POSTGRES = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${dbName}`;
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      this.logger.log(`Prisma migrations applied to ${dbName}.`);

      return {
        message: `Databases created: PostgreSQL: ${dbName}`,
        status: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error(`Error occurred: ${error.message}`);

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