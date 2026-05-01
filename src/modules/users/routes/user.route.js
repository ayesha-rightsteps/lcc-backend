import express from 'express';
import { validateRequest, authenticate, isAdmin } from '../../../shared/index.js';
import {
  createStudentSchema, heartbeatSchema, updateStatusSchema,
  updateIpsSchema, updateStudentSchema, setPasswordSchema,
} from '../validations/user.schema.js';
import {
  getStudents, createStudent, updateStudent, updateHeartbeat, locationDenied,
  updateStudentStatus, resetStudentPassword, setStudentPassword, updateIps, acceptTerms, deleteStudent,
} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/heartbeat', authenticate, validateRequest(heartbeatSchema), updateHeartbeat);
router.post('/location-denied', authenticate, locationDenied);
router.post('/accept-terms', authenticate, acceptTerms);
router.get('/students', authenticate, isAdmin, getStudents);
router.post('/students', authenticate, isAdmin, validateRequest(createStudentSchema), createStudent);
router.post('/:studentId/update', authenticate, isAdmin, validateRequest(updateStudentSchema), updateStudent);
router.post('/:studentId/status', authenticate, isAdmin, validateRequest(updateStatusSchema), updateStudentStatus);
router.post('/:studentId/reset-password', authenticate, isAdmin, resetStudentPassword);
router.post('/:studentId/set-password', authenticate, isAdmin, validateRequest(setPasswordSchema), setStudentPassword);
router.post('/:studentId/ips', authenticate, isAdmin, validateRequest(updateIpsSchema), updateIps);
router.post('/:studentId/delete', authenticate, isAdmin, deleteStudent);

export { router as userRoutes };
