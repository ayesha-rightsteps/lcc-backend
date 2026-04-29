import User from '../../../models/user.model.js';
import Ticket from '../../../models/ticket.model.js';
import Consultation from '../../../models/consultation.model.js';
import SecurityAlert from '../../../models/securityAlert.model.js';

const getDashboardSummaryService = async () => {
  const currentDate = new Date();
  const fourteenDaysFromNow = new Date();
  fourteenDaysFromNow.setDate(currentDate.getDate() + 14);

  const [
    totalStudents,
    activeStudents,
    expiringSoon,
    blockedOrInactive,
    openTickets,
    pendingConsultations,
    unreviewedAlerts,
  ] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'student', isActive: true, isBlocked: false }),
    User.find({
      role: 'student',
      isActive: true,
      validityDate: { $gte: currentDate, $lte: fourteenDaysFromNow },
    }).select('fullName email validityDate').sort('validityDate').lean(),
    User.countDocuments({ role: 'student', $or: [{ isActive: false }, { isBlocked: true }] }),
    Ticket.countDocuments({ isActive: true, status: 'open' }),
    Consultation.countDocuments({ isActive: true, status: 'pending' }),
    SecurityAlert.countDocuments({ isActive: true, isReviewed: false }),
  ]);

  return {
    totalStudents,
    activeStudents,
    blockedOrInactive,
    openTickets,
    pendingConsultations,
    unreviewedAlerts,
    expiringSoon,
  };
};

const getExpiringStudentsService = async (days = 14) => {
  const currentDate = new Date();
  const futureDate = new Date();
  futureDate.setDate(currentDate.getDate() + Number(days));

  return await User.find({
    role: 'student',
    isActive: true,
    validityDate: { $gte: currentDate, $lte: futureDate },
  })
    .select('fullName email phone courseName validityDate enrollmentId')
    .sort('validityDate')
    .lean();
};

const getConsultationReportService = async () => {
  const [total, pending, accepted, rejected, completed, paidConsultations] = await Promise.all([
    Consultation.countDocuments({ isActive: true }),
    Consultation.countDocuments({ isActive: true, status: 'pending' }),
    Consultation.countDocuments({ isActive: true, status: 'accepted' }),
    Consultation.countDocuments({ isActive: true, status: 'rejected' }),
    Consultation.countDocuments({ isActive: true, status: 'completed' }),
    Consultation.find({ isActive: true, paymentStatus: 'paid' })
      .select('paymentAmount student')
      .populate('student', 'fullName email')
      .lean(),
  ]);

  const totalRevenue = paidConsultations.reduce((sum, c) => sum + (c.paymentAmount || 0), 0);

  return {
    total,
    pending,
    accepted,
    rejected,
    completed,
    totalRevenue,
    paidSessions: paidConsultations.length,
    recentPaid: paidConsultations.slice(0, 10),
  };
};

const getTicketReportService = async () => {
  const [total, open, inProgress, resolved, closed] = await Promise.all([
    Ticket.countDocuments({ isActive: true }),
    Ticket.countDocuments({ isActive: true, status: 'open' }),
    Ticket.countDocuments({ isActive: true, status: 'in_progress' }),
    Ticket.countDocuments({ isActive: true, status: 'resolved' }),
    Ticket.countDocuments({ isActive: true, status: 'closed' }),
  ]);

  return { total, open, inProgress, resolved, closed };
};

const getSuspiciousIpsService = async () => {
  const users = await User.find({
    role: 'student',
    'allowedIps.isBlocked': true,
  }).select('fullName email allowedIps').lean();

  return users.map(user => ({
    studentId: user._id,
    fullName: user.fullName,
    email: user.email,
    blockedIps: user.allowedIps.filter(ip => ip.isBlocked).map(ip => ip.ip),
  }));
};

const getStudentRadarService = async (studentId) => {
  const student = await User.findById(studentId)
    .select('fullName lastSeen lastLat lastLng allowedIps')
    .lean();
  if (!student) {
    const error = new Error('Student not found');
    error.statusCode = 404;
    throw error;
  }
  return student;
};

const getStudentGrowthService = async (days = 7) => {
  const numDays = Math.min(parseInt(days, 10) || 7, 90);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (numDays - 1));
  startDate.setHours(0, 0, 0, 0);

  const rows = await User.aggregate([
    { $match: { role: 'student', createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const countByDate = {};
  rows.forEach((r) => { countByDate[r._id] = r.count; });

  const result = [];
  for (let i = 0; i < numDays; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, count: countByDate[key] || 0 });
  }

  return result;
};

const buildDailyTrend = async (Model, matchExtra = {}, days = 7) => {
  const numDays = Math.min(parseInt(days, 10) || 7, 90);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (numDays - 1));
  startDate.setHours(0, 0, 0, 0);

  const rows = await Model.aggregate([
    { $match: { isActive: true, createdAt: { $gte: startDate }, ...matchExtra } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const countByDate = {};
  rows.forEach((r) => { countByDate[r._id] = r.count; });

  const result = [];
  for (let i = 0; i < numDays; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, count: countByDate[key] || 0 });
  }
  return result;
};

const getTicketTrendService = (days = 7) => buildDailyTrend(Ticket, {}, days);

const getConsultationTrendService = (days = 7) => buildDailyTrend(Consultation, {}, days);

const getAlertBreakdownService = async (days) => {
  const match = { isActive: true };
  if (days) {
    const numDays = Math.min(parseInt(days, 10) || 7, 365);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numDays);
    startDate.setHours(0, 0, 0, 0);
    match.createdAt = { $gte: startDate };
  }
  const rows = await SecurityAlert.aggregate([
    { $match: match },
    { $group: { _id: '$alertType', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  return rows.map(r => ({ alertType: r._id, count: r.count }));
};

export {
  getDashboardSummaryService,
  getExpiringStudentsService,
  getConsultationReportService,
  getTicketReportService,
  getSuspiciousIpsService,
  getStudentRadarService,
  getStudentGrowthService,
  getTicketTrendService,
  getConsultationTrendService,
  getAlertBreakdownService,
};
