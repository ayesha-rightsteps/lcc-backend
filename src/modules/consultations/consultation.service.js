import Consultation from '../../models/consultation.model.js';
import User from '../../models/user.model.js';
import { AppError } from '../../shared/index.js';
import { sendEmail } from '../../config/email.js';

const requestConsultationService = async (studentId, data) => {
  const student = await User.findById(studentId);
  if (!student) throw new AppError('Student not found', 404);

  const isFree = !student.freeConsultationUsed;

  const consultation = await Consultation.create({
    student: studentId,
    reason: data.reason,
    isFree
  });

  if (isFree) {
    student.freeConsultationUsed = true;
    await student.save();
  }

  return consultation;
};

const getMyConsultationsService = async (studentId) => {
  return await Consultation.find({ student: studentId, isActive: true }).sort('-createdAt');
};

const getAllConsultationsService = async (query) => {
  const filter = { isActive: true };
  if (query.status) Object.assign(filter, { status: query.status });
  return await Consultation.find(filter).populate('student', 'fullName email phone').sort('-createdAt');
};

const acceptConsultationService = async (consultationId, data) => {
  const consultation = await Consultation.findByIdAndUpdate(
    consultationId,
    {
      status: 'accepted',
      meetingLink: data.meetingLink,
      meetingDate: data.meetingDate,
      meetingTime: data.meetingTime
    },
    { new: true }
  ).populate('student', 'fullName email');

  if (!consultation || !consultation.isActive) throw new AppError('Consultation not found', 404);

  const emailHtml = `
    <h2>LCC Academy - Consultation Scheduled</h2>
    <p>Dear ${consultation.student.fullName},</p>
    <p>Sir has accepted your consultation request.</p>
    <br/>
    <p><strong>Meeting Details:</strong></p>
    <p>Date: <b>${new Date(data.meetingDate).toDateString()}</b></p>
    <p>Time: <b>${data.meetingTime}</b></p>
    <p>Link: <a href="${data.meetingLink}">${data.meetingLink}</a></p>
    <br/>
    <p>Please be on time.</p>
  `;

  await sendEmail({
    to: consultation.student.email,
    subject: 'Consultation Scheduled - LCC Academy',
    html: emailHtml
  });

  return consultation;
};

const rejectConsultationService = async (consultationId, data) => {
  const consultation = await Consultation.findByIdAndUpdate(
    consultationId,
    { status: 'rejected', rejectionReason: data.rejectionReason },
    { new: true }
  ).populate('student', 'fullName email');

  if (!consultation) throw new AppError('Consultation not found', 404);

  if (consultation.isFree) {
    // Refund the free slot if sir rejects it
    await User.findByIdAndUpdate(consultation.student._id, { freeConsultationUsed: false });
  }

  const emailHtml = `
    <h2>LCC Academy - Consultation Update</h2>
    <p>Dear ${consultation.student.fullName},</p>
    <p>Unfortunately, Sir is unable to accept your consultation request at this time.</p>
    ${data.rejectionReason ? `<p>Reason: ${data.rejectionReason}</p>` : ''}
  `;

  await sendEmail({
    to: consultation.student.email,
    subject: 'Consultation Update - LCC Academy',
    html: emailHtml
  });

  return consultation;
};

const markCompletedService = async (consultationId, data) => {
  const consultation = await Consultation.findById(consultationId);
  if (!consultation) throw new AppError('Consultation not found', 404);

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
  requestConsultationService, getMyConsultationsService, 
  getAllConsultationsService, acceptConsultationService, 
  rejectConsultationService, markCompletedService 
};
