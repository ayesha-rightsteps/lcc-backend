import SecurityAlert from '../../models/securityAlert.model.js';
import { AppError } from '../../shared/index.js';

const logAlertService = async (studentId, ip, device, data) => {
  return await SecurityAlert.create({
    student: studentId,
    ip,
    device,
    alertType: data.alertType,
    description: data.description
  });
};

const getAlertsService = async (query) => {
  const filter = { isActive: true };
  if (query.isReviewed !== undefined) {
    filter.isReviewed = query.isReviewed === 'true';
  }

  return await SecurityAlert.find(filter)
    .populate('student', 'fullName email username')
    .sort('-createdAt')
    .limit(100);
};

const markAlertReviewedService = async (alertId) => {
  const alert = await SecurityAlert.findByIdAndUpdate(
    alertId,
    { isReviewed: true },
    { new: true }
  );

  if (!alert) throw new AppError('Alert not found', 404);
  return alert;
};

export { logAlertService, getAlertsService, markAlertReviewedService };
