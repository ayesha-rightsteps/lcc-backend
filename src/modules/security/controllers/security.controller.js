import { asyncHandler, httpResponse, httpError, responseMessage, logger } from '../../../shared/index.js';
import { logAlertService, getAlertsService, markAlertReviewedService } from '../services/security.service.js';

const logAlert = asyncHandler(async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
    const device = req.headers['user-agent'] || 'Unknown';
    await logAlertService(req.user._id, ip, device, req.body);
    logger.info('Security alert logged', { userId: req.user._id, requestId: req.requestId });
    return httpResponse(req, res, 201, responseMessage.custom('Security event logged'), null);
  } catch (error) {
    logger.error('Log alert failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const getAlerts = asyncHandler(async (req, res) => {
  try {
    const result = await getAlertsService(req.query);
    logger.info('Security alerts fetched', { requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Alerts fetched'), result);
  } catch (error) {
    logger.error('Get alerts failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const markAlertReviewed = asyncHandler(async (req, res) => {
  try {
    await markAlertReviewedService(req.params.id);
    logger.info('Alert marked reviewed', { alertId: req.params.id, requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Alert marked as reviewed'), null);
  } catch (error) {
    logger.error('Mark alert reviewed failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

export { logAlert, getAlerts, markAlertReviewed };
