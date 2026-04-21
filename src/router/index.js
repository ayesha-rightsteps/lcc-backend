import express from 'express';
import { healthRoutes } from '../modules/health/index.js';
import { authRoutes } from '../modules/auth/index.js';
import { userRoutes } from '../modules/users/index.js';
import { contentRoutes } from '../modules/content/index.js';
import { ticketRoutes } from '../modules/tickets/index.js';
import { consultationRoutes } from '../modules/consultations/index.js';
import { reportRoutes } from '../modules/reports/index.js';

const router = express.Router();

// Register module routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/content', contentRoutes);
router.use('/tickets', ticketRoutes);
router.use('/consultations', consultationRoutes);
router.use('/reports', reportRoutes);

export default router;
