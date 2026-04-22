import express from 'express';
import { validateRequest, authenticate, isAdmin } from '../../../shared/index.js';
import { createTicketSchema, replyTicketSchema, updateStatusSchema } from '../validations/ticket.schema.js';
import { createTicket, getMyTickets, getAllTickets, getTicketById, replyTicket, updateStatus } from '../controllers/ticket.controller.js';

const router = express.Router();

router.post('/', authenticate, validateRequest(createTicketSchema), createTicket);
router.get('/my-tickets', authenticate, getMyTickets);
router.get('/:ticketId', authenticate, getTicketById);
router.post('/:ticketId/reply', authenticate, validateRequest(replyTicketSchema), replyTicket);
router.get('/', authenticate, isAdmin, getAllTickets);
router.patch('/:ticketId/status', authenticate, isAdmin, validateRequest(updateStatusSchema), updateStatus);

export { router as ticketRoutes };
