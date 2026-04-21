import express from 'express';
import { validateRequest, authenticate, isAdmin } from '../../../shared/index.js';
import {
  requestConsultationSchema,
  acceptConsultationSchema,
  rejectConsultationSchema,
  completeConsultationSchema,
} from '../validations/consultation.schema.js';
import {
  requestConsultation,
  getMyConsultations,
  getAllConsultations,
  acceptConsultation,
  rejectConsultation,
  completeConsultation,
} from '../controllers/consultation.controller.js';

const router = express.Router();

router.post('/', authenticate, validateRequest(requestConsultationSchema), requestConsultation);
router.get('/my-consultations', authenticate, getMyConsultations);
router.get('/', authenticate, isAdmin, getAllConsultations);
router.post('/:id/accept', authenticate, isAdmin, validateRequest(acceptConsultationSchema), acceptConsultation);
router.post('/:id/reject', authenticate, isAdmin, validateRequest(rejectConsultationSchema), rejectConsultation);
router.post('/:id/complete', authenticate, isAdmin, validateRequest(completeConsultationSchema), completeConsultation);

export { router as consultationRoutes };
