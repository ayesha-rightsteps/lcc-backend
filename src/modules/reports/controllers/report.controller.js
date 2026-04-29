import { asyncHandler, httpResponse, httpError, responseMessage, logger } from '../../../shared/index.js';
import {
  getDashboardSummaryService,
  getExpiringStudentsService,
  getConsultationReportService,
  getTicketReportService,
  getSuspiciousIpsService,
  getStudentRadarService,
  getStudentGrowthService,
  getTicketTrendService,
  getConsultationTrendService,
  getAlertBreakdownService,
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

const getExpiringStudents = asyncHandler(async (req, res) => {
  try {
    const result = await getExpiringStudentsService(req.query.days);
    logger.info('Expiring students fetched', { requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Expiring students fetched'), result);
  } catch (error) {
    logger.error('Expiring students fetch failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const getConsultationReport = asyncHandler(async (req, res) => {
  try {
    const result = await getConsultationReportService();
    logger.info('Consultation report fetched', { requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Consultation report fetched'), result);
  } catch (error) {
    logger.error('Consultation report failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const getTicketReport = asyncHandler(async (req, res) => {
  try {
    const result = await getTicketReportService();
    logger.info('Ticket report fetched', { requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Ticket report fetched'), result);
  } catch (error) {
    logger.error('Ticket report failed', { error: error.message, requestId: req.requestId });
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

const getStudentGrowth = asyncHandler(async (req, res) => {
  try {
    const result = await getStudentGrowthService(req.query.days);
    logger.info('Student growth fetched', { requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Student growth fetched'), result);
  } catch (error) {
    logger.error('Student growth failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const getTicketTrend = asyncHandler(async (req, res) => {
  try {
    const result = await getTicketTrendService(req.query.days);
    logger.info('Ticket trend fetched', { requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Ticket trend fetched'), result);
  } catch (error) {
    logger.error('Ticket trend failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const getConsultationTrend = asyncHandler(async (req, res) => {
  try {
    const result = await getConsultationTrendService(req.query.days);
    logger.info('Consultation trend fetched', { requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Consultation trend fetched'), result);
  } catch (error) {
    logger.error('Consultation trend failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const getAlertBreakdown = asyncHandler(async (req, res) => {
  try {
    const result = await getAlertBreakdownService(req.query.days);
    logger.info('Alert breakdown fetched', { requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Alert breakdown fetched'), result);
  } catch (error) {
    logger.error('Alert breakdown failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

export {
  getDashboardSummary,
  getExpiringStudents,
  getConsultationReport,
  getTicketReport,
  getSuspiciousIps,
  getStudentRadar,
  getStudentGrowth,
  getTicketTrend,
  getConsultationTrend,
  getAlertBreakdown,
};
