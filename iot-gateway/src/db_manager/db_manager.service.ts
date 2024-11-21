import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreateDatabasenDto } from '@dbManager/dto/create-database';
import mongoose, { Connection } from 'mongoose';
import * as Models from '@mongoose/index';

@Injectable()
export class DataBaseManagerService implements OnModuleInit {
  private readonly logger = new Logger(DataBaseManagerService.name);
  private mongo_connections: Map<string, Connection> = new Map();

  async onModuleInit() {
    this.logger.log('DbManager Alerts Service Connected to the database');
    mongoose.disconnect();
  }

  async getMongoConnection(databaseName: string): Promise<Connection> {
    if (this.mongo_connections.has(databaseName)) {
      return this.mongo_connections.get(databaseName);
    }

    const mongoUri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${databaseName}`;

    try {
      const connection = mongoose.createConnection(mongoUri);

      connection.on('error', (err) => {
        console.error(`Connection error for database ${databaseName}:`, err);
      });

      connection.once('open', () => {
        this.logger.log(`Connected to database ${databaseName}`);
      });

      this.mongo_connections.set(databaseName, connection);
      return connection;
    } catch (error) {
      console.error(`Error connecting to MongoDB database ${databaseName}:`, error);
      throw new Error(`Could not connect to MongoDB: ${error.message}`);
    }
  }

  async create(createDatabasenDto: CreateDatabasenDto) {
    const { name: dbName } = createDatabasenDto;
    const mongoUrl = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${dbName}`;

    try {
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
        message: `Database created:: MongoDB: ${dbName}`,
        status: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error(`Error occurred: ${error.message}`);

      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.dropDatabase();
        this.logger.log(`MongoDB database ${dbName} dropped due to error.`);
      }

      throw new RpcException({
        message: 'Error creating databases, rollback performed',
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      });
    }
  }
}