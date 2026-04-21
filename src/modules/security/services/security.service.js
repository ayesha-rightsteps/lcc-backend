import SecurityAlert from '../../../models/securityAlert.model.js';

const logAlertService = async (studentId, ip, device, data) => {
  return await SecurityAlert.create({
    student: studentId,
    ip,
    device,
    alertType: data.alertType,
    description: data.description,
  });
};

const getAlertsService = async (query) => {
  const filter = { isActive: true };
  if (query.isReviewed !== undefined) {
    filter.isReviewed = query.isReviewed === 'true';
  }

  return await SecurityAlert.find(filter)
    .select('student ip device alertType description isReviewed createdAt')
    .populate('student', 'fullName email username')
    .sort('-createdAt')
    .limit(100)
    .lean();
};

const markAlertReviewedService = async (alertId) => {
  const alert = await SecurityAlert.findByIdAndUpdate(
    alertId,
    { isReviewed: true },
    { new: true }
  ).select('isReviewed alertType student');

  if (!alert) {
    const error = new Error('Alert not found');
    error.statusCode = 404;
    throw error;
  }
  return alert;
};

export { logAlertService, getAlertsService, markAlertReviewedService };
