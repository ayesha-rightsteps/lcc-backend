import Ticket from '../../../models/ticket.model.js';

const createTicketService = async (studentId, data) => {
  return await Ticket.create({
    student: studentId,
    subject: data.subject,
    messages: [{ sender: studentId, message: data.message }],
  });
};

const getMyTicketsService = async (studentId) => {
  return await Ticket.find({ student: studentId, isActive: true })
    .select('subject status messages createdAt updatedAt')
    .sort('-createdAt')
    .lean();
};

const getAllTicketsService = async (query) => {
  const filter = { isActive: true };
  if (query.status) {
    filter.status = query.status;
  }

  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 15;
  const skip = (page - 1) * limit;

  const [total, items] = await Promise.all([
    Ticket.countDocuments(filter),
    Ticket.find(filter)
      .select('subject status messages student createdAt updatedAt')
      .populate('student', 'fullName email username')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  return { items, pagination: { total, page, limit, hasNextPage: skip + items.length < total } };
};

const getTicketByIdService = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId)
    .populate('student', 'fullName email username')
    .lean();
  if (!ticket || !ticket.isActive) {
    const error = new Error('Ticket not found');
    error.statusCode = 404;
    throw error;
  }
  return ticket;
};

const replyTicketService = async (ticketId, userId, isStudent, data) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket || !ticket.isActive) {
    const error = new Error('Ticket not found');
    error.statusCode = 404;
    throw error;
  }

  if (isStudent) {
    if (ticket.student.toString() !== userId.toString()) {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      throw error;
    }
    if (['resolved', 'closed'].includes(ticket.status)) {
      const error = new Error('Cannot reply to a resolved or closed ticket');
      error.statusCode = 400;
      throw error;
    }
  }

  ticket.messages.push({ sender: userId, message: data.message });
  await ticket.save();
  return ticket;
};

const updateStatusService = async (ticketId, data) => {
  const ticket = await Ticket.findByIdAndUpdate(
    ticketId,
    { status: data.status },
    { new: true }
  );
  if (!ticket) {
    const error = new Error('Ticket not found');
    error.statusCode = 404;
    throw error;
  }
  return ticket;
};

export {
  createTicketService,
  getMyTicketsService,
  getAllTicketsService,
  getTicketByIdService,
  replyTicketService,
  updateStatusService,
};
