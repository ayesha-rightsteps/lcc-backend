// Constants
export { EApplicationEnvironment } from './constant/application.js';

// Middleware
export {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  AppError,
  createError,
} from './middleware/errorHandler.js';
export { authenticate, isAdmin } from './middleware/auth.middleware.js';
export { validateRequest } from './middleware/validate.middleware.js';

// Utils
export { default as logger } from './utils/logger.js';
export {
  httpResponse,
  httpError,
  errorObject,
  responseMessage,
} from './utils/response.js';
export {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  setCookieOptions,
} from './utils/jwt.js';
export { hashPassword, comparePassword } from './utils/password.js';

// Services
export {
  welcomeStudentTemplate,
  passwordResetTemplate,
  consultationAcceptedTemplate,
  consultationRejectedTemplate,
} from './services/email-template.service.js';
