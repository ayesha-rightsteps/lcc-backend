import Consultation from '../../../models/consultation.model.js';
import User from '../../../models/user.model.js';
import { sendEmail } from '../../../config/email.js';
import { consultationAcceptedTemplate, consultationRejectedTemplate } from '../../../shared/index.js';

const requestConsultationService = async (studentId, data) => {
  const student = await User.findById(studentId).select('freeConsultationUsed').lean();
  if (!student) {
    const error = new Error('Student not found');
    error.statusCode = 404;
    throw error;
  }

  const isFree = !student.freeConsultationUsed;

  const consultation = await Consultation.create({
    student: studentId,
    reason: data.reason,
    isFree,
  });

  if (isFree) {
    await User.findByIdAndUpdate(studentId, { freeConsultationUsed: true });
  }

  return consultation;
};

const getMyConsultationsService = async (studentId) => {
  return await Consultation.find({ student: studentId, isActive: true })
    .select('reason status isFree meetingLink meetingDate meetingTime paymentStatus createdAt')
    .sort('-createdAt')
    .lean();
};

const getAllConsultationsService = async (query) => {
  const filter = { isActive: true };
  if (query.status) {
    filter.status = query.status;
  }
  return await Consultation.find(filter)
    .select('reason status isFree meetingLink meetingDate meetingTime paymentStatus student createdAt')
    .populate('student', 'fullName email phone')
    .sort('-createdAt')
    .lean();
};

const acceptConsultationService = async (consultationId, data) => {
  const consultation = await Consultation.findByIdAndUpdate(
    consultationId,
    {
      status: 'accepted',
      meetingLink: data.meetingLink,
      meetingDate: data.meetingDate,
      meetingTime: data.meetingTime,
    },
    { new: true }
  ).populate('student', 'fullName email');

  if (!consultation || !consultation.isActive) {
    const error = new Error('Consultation not found');
    error.statusCode = 404;
    throw error;
  }

  const acceptedEmail = consultationAcceptedTemplate(
    consultation.student.fullName,
    data.meetingDate,
    data.meetingTime,
    data.meetingLink
  );
  await sendEmail({ to: consultation.student.email, ...acceptedEmail });

  return consultation;
};

const rejectConsultationService = async (consultationId, data) => {
  const consultation = await Consultation.findByIdAndUpdate(
    consultationId,
    { status: 'rejected', rejectionReason: data.rejectionReason },
    { new: true }
  ).populate('student', 'fullName email');

  if (!consultation) {
    const error = new Error('Consultation not found');
    error.statusCode = 404;
    throw error;
  }

  if (consultation.isFree) {
    await User.findByIdAndUpdate(consultation.student._id, { freeConsultationUsed: false });
  }

  const rejectedEmail = consultationRejectedTemplate(
    consultation.student.fullName,
    data.rejectionReason
  );
  await sendEmail({ to: consultation.student.email, ...rejectedEmail });

  return consultation;
};

const markCompletedService = async (consultationId, data) => {
  const consultation = await Consultation.findById(consultationId);
  if (!consultation) {
    const error = new Error('Consultation not found');
    error.statusCode = 404;
    throw error;
  }

  consultation.status = 'completed';
  if (data.paymentStatus === 'paid') {
    consultation.paymentStatus = 'paid';
    consultation.paymentAmount = data.paymentAmount || 0;
    consultation.paymentReceivedAt = new Date();
  }

  await consultation.save();
  return consultation;
};

export {
  requestConsultationService,
  getMyConsultationsService,
  getAllConsultationsService,
  acceptConsultationService,
  rejectConsultationService,
  markCompletedService,
};
