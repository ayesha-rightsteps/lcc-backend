import { asyncHandler, httpResponse, httpError, responseMessage, logger } from '../../../shared/index.js';
import {
  getDashboardSummaryService,
  getSuspiciousIpsService,
  getStudentRadarService,
  getContentLogsService,
} from '../services/report.service.js';

const getDashboardSummary = asyncHandler(async (req, res) => {
  try {
    const result = await getDashboardSummaryService();
    logger.info('Dashboard summary fetched', { requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Dashboard stats fetched'), result);
  } catch (error) {
    logger.error('Dashboard summary failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const getSuspiciousIps = asyncHandler(async (req, res) => {
  try {
    const result = await getSuspiciousIpsService();
    logger.info('Suspicious IPs fetched', { requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Suspicious IPs fetched'), result);
  } catch (error) {
    logger.error('Suspicious IPs fetch failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const getStudentRadar = asyncHandler(async (req, res) => {
  try {
    const result = await getStudentRadarService(req.params.studentId);
    logger.info('Student radar fetched', { studentId: req.params.studentId, requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Radar data fetched'), result);
  } catch (error) {
    logger.error('Student radar failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const getContentLogs = asyncHandler(async (req, res) => {
  try {
    const result = await getContentLogsService();
    logger.info('Content logs fetched', { requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Content logs fetched'), result);
  } catch (error) {
    logger.error('Content logs fetch failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

export { getDashboardSummary, getSuspiciousIps, getStudentRadar, getContentLogs };
