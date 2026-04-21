import express from 'express';
import { validateRequest, authenticate, isAdmin } from '../../shared/index.js';
import { createTicketSchema, replyTicketSchema, updateStatusSchema } from './ticket.schema.js';
import { createTicket, getMyTickets, getAllTickets, replyTicket, updateStatus } from './ticket.controller.js';

const router = express.Router();

// Mixed
router.post('/:ticketId/reply', authenticate, validateRequest(replyTicketSchema), replyTicket);

// Student routes
router.post('/', authenticate, validateRequest(createTicketSchema), createTicket);
router.get('/my-tickets', authenticate, getMyTickets);

// Admin routes
router.get('/', authenticate, isAdmin, getAllTickets);
router.patch('/:ticketId/status', authenticate, isAdmin, validateRequest(updateStatusSchema), updateStatus);

export { router as ticketRoutes };
