import { asyncHandler, httpResponse, responseMessage } from '../../shared/index.js';
import { loginService } from './auth.service.js';

const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
  const device = req.headers['user-agent'] || 'Unknown';

  const result = await loginService({ identifier, password, ip, device });

  return httpResponse(req, res, 200, responseMessage.custom('Login successful'), result);
});

export { login };
