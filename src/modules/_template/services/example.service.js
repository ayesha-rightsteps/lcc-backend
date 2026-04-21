import { getMongoose } from '../../../config/databases.js';
import { logger } from '../../../shared/index.js';

const exampleService = async (data) => {
  try {
    logger.info('Example service called', { data });

    const mongoose = getMongoose();
    const result = { acknowledged: true, data };

    return result;
  } catch (error) {
    logger.error('Example service failed', { error: error.message, data });
    throw error;
  }
};

export { exampleService };
