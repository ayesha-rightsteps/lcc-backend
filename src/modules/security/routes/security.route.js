import express from 'express';
import { validateRequest, authenticate, isAdmin } from '../../../shared/index.js';
import { createAlertSchema } from '../validations/security.schema.js';
import { logAlert, getAlerts, markAlertReviewed } from '../controllers/security.controller.js';

const router = express.Router();

router.post('/alerts', authenticate, validateRequest(createAlertSchema), logAlert);
router.get('/alerts', authenticate, isAdmin, getAlerts);
router.post('/alerts/:id/review', authenticate, isAdmin, markAlertReviewed);

export { router as securityRoutes };
