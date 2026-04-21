import { asyncHandler, httpResponse, responseMessage } from '../../shared/index.js';
import { 
  getDashboardSummaryService, getSuspiciousIpsService, 
  getStudentRadarService, getContentLogsService 
} from './report.service.js';

const getDashboardSummary = asyncHandler(async (req, res) => {
  const result = await getDashboardSummaryService();
  return httpResponse(req, res, 200, responseMessage.custom('Dashboard stats fetched'), result);
});

const getSuspiciousIps = asyncHandler(async (req, res) => {
  const result = await getSuspiciousIpsService();
  return httpResponse(req, res, 200, responseMessage.custom('Suspicious IPs fetched'), result);
});

const getStudentRadar = asyncHandler(async (req, res) => {
  const result = await getStudentRadarService(req.params.studentId);
  return httpResponse(req, res, 200, responseMessage.custom('Radar data fetched'), result);
});

const getContentLogs = asyncHandler(async (req, res) => {
  const result = await getContentLogsService();
  return httpResponse(req, res, 200, responseMessage.custom('Logs fetched'), result);
});

export { getDashboardSummary, getSuspiciousIps, getStudentRadar, getContentLogs };
