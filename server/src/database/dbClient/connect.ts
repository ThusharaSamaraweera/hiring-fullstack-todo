import mongoose from 'mongoose';
import { logger } from '@/utils/index.js';

export async function connectToDatabase(uri: string): Promise<void> {
  logger.info('Connecting to MongoDB');
  try {
    await mongoose.connect(uri);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection failed', { error });
    throw error;
  }
}

export async function disconnectFromDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}
