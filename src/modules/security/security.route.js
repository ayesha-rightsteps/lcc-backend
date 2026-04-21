import express from 'express';
import { validateRequest, authenticate, isAdmin } from '../../shared/index.js';
import { createAlertSchema } from './security.schema.js';
import { logAlert, getAlerts, markAlertReviewed } from './security.controller.js';

const router = express.Router();

// Student facing -> triggers invisible logs
router.post('/alerts', authenticate, validateRequest(createAlertSchema), logAlert);

// Admin strictly facing
router.get('/alerts', authenticate, isAdmin, getAlerts);
router.patch('/alerts/:id/review', authenticate, isAdmin, markAlertReviewed);

export { router as securityRoutes };
