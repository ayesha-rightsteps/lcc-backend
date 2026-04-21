import { asyncHandler, httpResponse, httpError, responseMessage, logger } from '../../../shared/index.js';
import { loginService } from '../services/auth.service.js';

const login = asyncHandler(async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
    const device = req.headers['user-agent'] || 'Unknown';

    const result = await loginService({ identifier, password, ip, device });

    logger.info('Login successful', { requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Login successful'), result);
  } catch (error) {
    logger.error('Login failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

export { login };
