import express from 'express';
import { validateRequest, authenticate, isAdmin } from '../../shared/index.js';
import { createContentSchema, accessControlSchema } from './content.schema.js';
import { getMyContent, createContent, manageAccess, streamContent } from './content.controller.js';

const router = express.Router();

// Student/Public routes
router.get('/my-content', authenticate, getMyContent);
router.get('/:contentId/stream', authenticate, streamContent);

// Admin-only routes
router.post('/', authenticate, isAdmin, validateRequest(createContentSchema), createContent);
router.post('/:contentId/access', authenticate, isAdmin, validateRequest(accessControlSchema), manageAccess);

export { router as contentRoutes };
