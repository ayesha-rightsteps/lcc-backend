import { asyncHandler, httpResponse, httpError, responseMessage, logger } from '../../../shared/index.js';
import {
  createTicketService,
  getMyTicketsService,
  getAllTicketsService,
  getTicketByIdService,
  replyTicketService,
  updateStatusService,
} from '../services/ticket.service.js';

const createTicket = asyncHandler(async (req, res) => {
  try {
    const result = await createTicketService(req.user._id, req.body);
    logger.info('Ticket created', { userId: req.user._id, requestId: req.requestId });
    return httpResponse(req, res, 201, responseMessage.custom('Ticket created successfully'), result);
  } catch (error) {
    logger.error('Create ticket failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const getMyTickets = asyncHandler(async (req, res) => {
  try {
    const result = await getMyTicketsService(req.user._id);
    logger.info('My tickets fetched', { userId: req.user._id, requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Tickets fetched successfully'), result);
  } catch (error) {
    logger.error('Get my tickets failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const getAllTickets = asyncHandler(async (req, res) => {
  try {
    const result = await getAllTicketsService(req.query);
    logger.info('All tickets fetched', { requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Tickets fetched successfully'), result);
  } catch (error) {
    logger.error('Get all tickets failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const getTicketById = asyncHandler(async (req, res) => {
  try {
    const result = await getTicketByIdService(req.params.ticketId);
    return httpResponse(req, res, 200, responseMessage.custom('Ticket fetched successfully'), result);
  } catch (error) {
    logger.error('Get ticket by id failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const replyTicket = asyncHandler(async (req, res) => {
  try {
    const isStudent = req.user.role === 'student';
    const result = await replyTicketService(req.params.ticketId, req.user._id, isStudent, req.body);
    logger.info('Ticket reply added', { userId: req.user._id, requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Reply added successfully'), result);
  } catch (error) {
    logger.error('Reply ticket failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const updateStatus = asyncHandler(async (req, res) => {
  try {
    const result = await updateStatusService(req.params.ticketId, req.body);
    logger.info('Ticket status updated', { requestId: req.requestId });
    return httpResponse(req, res, 200, responseMessage.custom('Status updated'), result);
  } catch (error) {
    logger.error('Update ticket status failed', { error: error.message, requestId: req.requestId });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

export { createTicket, getMyTickets, getAllTickets, getTicketById, replyTicket, updateStatus };
