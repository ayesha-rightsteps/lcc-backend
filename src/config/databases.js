import mongoose from 'mongoose';
import config from './index.js';
import { logger } from '../shared/index.js';

async function connectDatabases() {
  try {
    logger.info('🔌 Connecting to databases...');

    await mongoose.connect(config.mongodb.url, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.success('MongoDB connected');

    logger.success('All databases connected successfully');
  } catch (error) {
    logger.error(`❌ Database connection failed: ${error.message}`);
    throw error;
  }
}

function getMongoose() {
  return mongoose;
}

async function checkDatabaseHealth() {
  const health = {
    mongodb: { connected: false, latency: null },
    errors: [],
  };

  try {
    const mongoStart = Date.now();
    await mongoose.connection.db.admin().ping();
    health.mongodb.connected = true;
    health.mongodb.latency = Date.now() - mongoStart;
  } catch (error) {
    health.errors.push(`MongoDB: ${error.message}`);
  }

  return health;
}

async function disconnectDatabases() {
  try {
    logger.info('Disconnecting from databases...');

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      logger.info('✅ MongoDB disconnected');
    }

    logger.info('🎉 All databases disconnected successfully');
  } catch (error) {
    logger.error('❌ Error disconnecting from databases:', error);
  }
}

export { connectDatabases, disconnectDatabases, getMongoose, checkDatabaseHealth };
