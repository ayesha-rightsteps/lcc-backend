import express from 'express';
import { validateRequest, authenticate, isAdmin } from '../../shared/index.js';
import { createStudentSchema, heartbeatSchema, updateStatusSchema, updateIpsSchema } from './user.schema.js';
import { createStudent, updateHeartbeat, updateStudentStatus, resetStudentPassword, updateIps } from './user.controller.js';

const router = express.Router();

// Public/Student routes
router.post('/heartbeat', authenticate, validateRequest(heartbeatSchema), updateHeartbeat);

// Admin-only routes
router.post('/students', authenticate, isAdmin, validateRequest(createStudentSchema), createStudent);
router.patch('/:studentId/status', authenticate, isAdmin, validateRequest(updateStatusSchema), updateStudentStatus);
router.post('/:studentId/reset-password', authenticate, isAdmin, resetStudentPassword);
router.patch('/:studentId/ips', authenticate, isAdmin, validateRequest(updateIpsSchema), updateIps);

export { router as userRoutes };
