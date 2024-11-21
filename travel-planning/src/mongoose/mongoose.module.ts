// connectDB.ts
import mongoose from 'mongoose';
import { envs } from '@app/config';
import { Logger } from '@nestjs/common';
const logger = new Logger('Mongoose');

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(envs.database_url_mongodb);
    }
  } catch (error) {
    logger.error('Error al conectar a la base de datos:', error);
  }
};

export const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  } catch (error) {
    logger.error('Error al desconectar de la base de datos:', error);
  }
};