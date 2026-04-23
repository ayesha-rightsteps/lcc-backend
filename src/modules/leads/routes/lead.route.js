import express from 'express';
import { validateRequest, authenticate, isAdmin } from '../../../shared/index.js';
import { createLeadSchema, updateLeadStatusSchema } from '../validations/lead.schema.js';
import { createLead, getLeads, updateLeadStatus } from '../controllers/lead.controller.js';

const router = express.Router();

router.post('/', validateRequest(createLeadSchema), createLead);
router.get('/', authenticate, isAdmin, getLeads);
router.patch('/:leadId/status', authenticate, isAdmin, validateRequest(updateLeadStatusSchema), updateLeadStatus);

export { router as leadRoutes };
