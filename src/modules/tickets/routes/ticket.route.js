import express from 'express';
import { validateRequest, authenticate, isAdmin } from '../../../shared/index.js';
import { createTicketSchema, replyTicketSchema, updateStatusSchema } from '../validations/ticket.schema.js';
import { createTicket, getMyTickets, getAllTickets, replyTicket, updateStatus } from '../controllers/ticket.controller.js';

const router = express.Router();

router.post('/', authenticate, validateRequest(createTicketSchema), createTicket);
router.get('/my', authenticate, getMyTickets);
router.post('/:ticketId/reply', authenticate, validateRequest(replyTicketSchema), replyTicket);
router.get('/', authenticate, isAdmin, getAllTickets);
router.post('/:ticketId/status', authenticate, isAdmin, validateRequest(updateStatusSchema), updateStatus);

export { router as ticketRoutes };
