import express from 'express';
import { validateRequest, authenticate, isAdmin } from '../../../shared/index.js';
import { createStudentSchema, heartbeatSchema, updateStatusSchema, updateIpsSchema } from '../validations/user.schema.js';
import { getStudents, createStudent, updateHeartbeat, updateStudentStatus, resetStudentPassword, updateIps } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/students', authenticate, isAdmin, getStudents);
router.post('/heartbeat', authenticate, validateRequest(heartbeatSchema), updateHeartbeat);
router.post('/students', authenticate, isAdmin, validateRequest(createStudentSchema), createStudent);
router.patch('/:studentId/status', authenticate, isAdmin, validateRequest(updateStatusSchema), updateStudentStatus);
router.patch('/:studentId/reset-password', authenticate, isAdmin, resetStudentPassword);
router.patch('/:studentId/ips', authenticate, isAdmin, validateRequest(updateIpsSchema), updateIps);

export { router as userRoutes };
