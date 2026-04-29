import express from 'express';
import { authenticate, isAdmin } from '../../../shared/index.js';
import {
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
} from '../controllers/report.controller.js';

const router = express.Router();

router.use(authenticate, isAdmin);

router.get('/summary', getDashboardSummary);
router.get('/students/expiring', getExpiringStudents);
router.get('/consultations', getConsultationReport);
router.get('/tickets', getTicketReport);
router.get('/suspicious-ips', getSuspiciousIps);
router.get('/student/:studentId/radar', getStudentRadar);
router.get('/student-growth', getStudentGrowth);
router.get('/ticket-trend', getTicketTrend);
router.get('/consultation-trend', getConsultationTrend);
router.get('/alert-breakdown', getAlertBreakdown);

export { router as reportRoutes };
