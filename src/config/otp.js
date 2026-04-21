import crypto from 'crypto';
import config from './index.js';

const DEV_OTP = '123456';

export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const getOTP = () => {
  if (config.env === 'development' || config.env === 'production') {
    return DEV_OTP;
  }
  return generateOTP();
};

export const sendOTP = async (_identifier, _otp) => {
  if (config.env === 'development' || config.env === 'production') {
    return { success: true, dev: true };
  }

  throw new Error('OTP provider not configured for production');
};
