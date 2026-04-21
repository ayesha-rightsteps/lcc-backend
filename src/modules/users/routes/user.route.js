import express from 'express';
import { validateRequest, authenticate, isAdmin } from '../../../shared/index.js';
import { createStudentSchema, heartbeatSchema, updateStatusSchema, updateIpsSchema } from '../validations/user.schema.js';
import { createStudent, updateHeartbeat, updateStudentStatus, resetStudentPassword, updateIps } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/heartbeat', authenticate, validateRequest(heartbeatSchema), updateHeartbeat);
router.post('/students', authenticate, isAdmin, validateRequest(createStudentSchema), createStudent);
router.post('/:studentId/status', authenticate, isAdmin, validateRequest(updateStatusSchema), updateStudentStatus);
router.post('/:studentId/reset-password', authenticate, isAdmin, resetStudentPassword);
router.post('/:studentId/ips', authenticate, isAdmin, validateRequest(updateIpsSchema), updateIps);

export { router as userRoutes };
