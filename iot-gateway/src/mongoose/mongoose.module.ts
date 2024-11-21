import { envs } from '@config/envs';
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(envs.database_url_mongodb);
    }
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  } catch (error) {
    console.error('Error al desconectar de la base de datos:', error);
    throw error;
  }
};
