import Ticket from '../../models/ticket.model.js';
import { AppError } from '../../shared/index.js';

const createTicketService = async (studentId, data) => {
  return await Ticket.create({
    student: studentId,
    subject: data.subject,
    messages: [{
      sender: studentId,
      message: data.message
    }]
  });
};

const getMyTicketsService = async (studentId) => {
  return await Ticket.find({ student: studentId, isActive: true }).sort('-createdAt');
};

const getAllTicketsService = async (query) => {
  const filter = { isActive: true };
  if (query.status) Object.assign(filter, { status: query.status });
  return await Ticket.find(filter).populate('student', 'fullName email username').sort('-createdAt');
};

const replyTicketService = async (ticketId, userId, isStudent, data) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket || !ticket.isActive) throw new AppError('Ticket not found', 404);

  if (isStudent) {
    if (ticket.student.toString() !== userId.toString()) throw new AppError('Unauthorized', 403);
    if (['resolved', 'closed'].includes(ticket.status)) {
      throw new AppError('Cannot reply to a resolved or closed ticket', 400);
    }
  }

  ticket.messages.push({
    sender: userId,
    message: data.message
  });

  await ticket.save();
  return ticket;
};

const updateStatusService = async (ticketId, data) => {
  const ticket = await Ticket.findByIdAndUpdate(
    ticketId,
    { status: data.status },
    { new: true }
  );
  if (!ticket) throw new AppError('Ticket not found', 404);
  return ticket;
};

export { createTicketService, getMyTicketsService, getAllTicketsService, replyTicketService, updateStatusService };
