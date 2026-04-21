import express from 'express';
import { authenticate, isAdmin } from '../../shared/index.js';
import { 
  getDashboardSummary, getSuspiciousIps, 
  getStudentRadar, getContentLogs 
} from './report.controller.js';

const router = express.Router();

// All reporting routes strictly Admin only
router.use(authenticate, isAdmin);

router.get('/summary', getDashboardSummary);
router.get('/suspicious-ips', getSuspiciousIps);
router.get('/student/:studentId/radar', getStudentRadar);
router.get('/content-logs', getContentLogs);

export { router as reportRoutes };
