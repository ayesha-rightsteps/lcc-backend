import express from 'express';
import { validateRequest, authenticate, isAdmin } from '../../shared/index.js';
import { requestConsultationSchema, acceptConsultationSchema, rejectConsultationSchema, completeConsultationSchema } from './consultation.schema.js';
import { 
  requestConsultation, getMyConsultations, getAllConsultations, 
  acceptConsultation, rejectConsultation, completeConsultation 
} from './consultation.controller.js';

const router = express.Router();

// Student
router.post('/', authenticate, validateRequest(requestConsultationSchema), requestConsultation);
router.get('/my-consultations', authenticate, getMyConsultations);

// Admin
router.get('/', authenticate, isAdmin, getAllConsultations);
router.post('/:id/accept', authenticate, isAdmin, validateRequest(acceptConsultationSchema), acceptConsultation);
router.post('/:id/reject', authenticate, isAdmin, validateRequest(rejectConsultationSchema), rejectConsultation);
router.patch('/:id/status', authenticate, isAdmin, validateRequest(completeConsultationSchema), completeConsultation);

export { router as consultationRoutes };
