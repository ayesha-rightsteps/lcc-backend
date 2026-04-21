import { asyncHandler, httpResponse, responseMessage } from '../../shared/index.js';
import {
  createTicketService, getMyTicketsService, getAllTicketsService,
  replyTicketService, updateStatusService
} from './ticket.service.js';

const createTicket = asyncHandler(async (req, res) => {
  const result = await createTicketService(req.user._id, req.body);
  return httpResponse(req, res, 201, responseMessage.custom('Ticket created successfully'), result);
});

const getMyTickets = asyncHandler(async (req, res) => {
  const result = await getMyTicketsService(req.user._id);
  return httpResponse(req, res, 200, responseMessage.custom('Tickets fetched successfully'), result);
});

const getAllTickets = asyncHandler(async (req, res) => {
  const result = await getAllTicketsService(req.query);
  return httpResponse(req, res, 200, responseMessage.custom('Tickets fetched successfully'), result);
});

const replyTicket = asyncHandler(async (req, res) => {
  const isStudent = req.user.role === 'student';
  const result = await replyTicketService(req.params.ticketId, req.user._id, isStudent, req.body);
  return httpResponse(req, res, 200, responseMessage.custom('Reply added successfully'), result);
});

const updateStatus = asyncHandler(async (req, res) => {
  const result = await updateStatusService(req.params.ticketId, req.body);
  return httpResponse(req, res, 200, responseMessage.custom('Status updated'), result);
});

export { createTicket, getMyTickets, getAllTickets, replyTicket, updateStatus };
