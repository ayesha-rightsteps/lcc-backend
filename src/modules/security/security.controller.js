import { asyncHandler, httpResponse, responseMessage } from '../../shared/index.js';
import { logAlertService, getAlertsService, markAlertReviewedService } from './security.service.js';

const logAlert = asyncHandler(async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
  const device = req.headers['user-agent'] || 'Unknown';
  
  await logAlertService(req.user._id, ip, device, req.body);
  return httpResponse(req, res, 201, responseMessage.custom('Security event logged silently'), null);
});

const getAlerts = asyncHandler(async (req, res) => {
  const result = await getAlertsService(req.query);
  return httpResponse(req, res, 200, responseMessage.custom('Alerts fetched'), result);
});

const markAlertReviewed = asyncHandler(async (req, res) => {
  await markAlertReviewedService(req.params.id);
  return httpResponse(req, res, 200, responseMessage.custom('Alert marked as reviewed'), null);
});

export { logAlert, getAlerts, markAlertReviewed };
