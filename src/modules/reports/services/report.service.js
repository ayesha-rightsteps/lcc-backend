import User from '../../../models/user.model.js';
import ContentLog from '../../../models/contentLog.model.js';

const getDashboardSummaryService = async () => {
  const currentDate = new Date();
  const fourteenDaysFromNow = new Date();
  fourteenDaysFromNow.setDate(currentDate.getDate() + 14);

  const [totalStudents, activeStudents, expiringSoon, inactiveStudents] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'student', isActive: true, isBlocked: false }),
    User.find({
      role: 'student',
      isActive: true,
      validityDate: { $gte: currentDate, $lte: fourteenDaysFromNow }
    }).select('fullName email validityDate').sort('validityDate').lean(),
    User.countDocuments({ role: 'student', $or: [{ isActive: false }, { isBlocked: true }] })
  ]);

  return {
    totalStudents,
    activeStudents,
    blockedOrInactive: inactiveStudents,
    expiringSoonList: expiringSoon
  };
};

const getSuspiciousIpsService = async () => {
  const users = await User.find({
    role: 'student',
    'allowedIps.isBlocked': true
  }).select('fullName email allowedIps').lean();

  return users.map(user => ({
    studentId: user._id,
    fullName: user.fullName,
    email: user.email,
    blockedIps: user.allowedIps.filter(ip => ip.isBlocked).map(ip => ip.ip)
  }));
};

const getStudentRadarService = async (studentId) => {
  const student = await User.findById(studentId).select('lastSeen lastLat lastLng allowedIps').lean();
  return student;
};

const getContentLogsService = async () => {
  return await ContentLog.find({ isActive: true })
    .populate('student', 'fullName email')
    .populate('content', 'title type')
    .sort('-createdAt')
    .limit(100)
    .lean();
};

export {
  getDashboardSummaryService, getSuspiciousIpsService,
  getStudentRadarService, getContentLogsService
};
