import crypto from 'crypto';
import User from '../../../models/user.model.js';
import { hashPassword, welcomeStudentTemplate, passwordResetTemplate } from '../../../shared/index.js';
import { sendEmail } from '../../../config/email.js';

const generateUsername = async (fullName) => {
  const base = fullName.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  let isUnique = false;
  let username = '';

  while (!isUnique) {
    const randomNum = Math.floor(1000 + (Math.random() * 9000));
    username = `${base}_lcc_${randomNum}`;
    const existing = await User.findOne({ username });
    if (!existing) { isUnique = true; }
  }
  return username;
};

const generateRandomPassword = () => {
  return crypto.randomBytes(6).toString('hex');
};

const generateEnrollmentId = async () => {
  let isUnique = false;
  let enrollId = '';

  while (!isUnique) {
    const randomNum = Math.floor(100000 + (Math.random() * 900000));
    enrollId = `LCC-STU-${randomNum}`;
    const existing = await User.findOne({ enrollmentId: enrollId });
    if (!existing) { isUnique = true; }
  }
  return enrollId;
};

const createStudentService = async (adminId, data) => {
  const existingEmail = await User.findOne({ email: data.email.toLowerCase() });
  if (existingEmail) {
    const error = new Error('Email is already registered to another user');
    error.statusCode = 400;
    throw error;
  }

  const username = await generateUsername(data.fullName);
  const plainPassword = generateRandomPassword();
  const enrollmentId = await generateEnrollmentId();
  const hashedPassword = await hashPassword(plainPassword);
  const paymentDate = data.paymentDate ? new Date(data.paymentDate) : new Date();

  const validityDate = new Date(paymentDate);
  validityDate.setDate(validityDate.getDate() + data.courseDuration);

  const newStudent = await User.create({
    role: 'student',
    fullName: data.fullName,
    email: data.email.toLowerCase(),
    phone: data.phone,
    courseName: data.courseName,
    courseDuration: data.courseDuration,
    paymentAmount: data.paymentAmount,
    paymentDate,
    validityDate,
    username,
    password: hashedPassword,
    enrollmentId,
    allowedIps: [],
    isActive: true,
  });

  const welcomeEmail = welcomeStudentTemplate(newStudent.fullName, username, plainPassword);
  await sendEmail({ to: newStudent.email, ...welcomeEmail });

  const studentObj = newStudent.toObject();
  delete studentObj.password;

  return {
    student: studentObj,
    credentialsGenerated: { username, password: plainPassword },
  };
};

const updateHeartbeatService = async (userId, data) => {
  await User.findByIdAndUpdate(userId, {
    lastSeen: new Date(),
    ...(data.lat && { lastLat: data.lat }),
    ...(data.lng && { lastLng: data.lng }),
  });
  return null;
};

const updateStudentStatusService = async (studentId, data) => {
  const user = await User.findById(studentId);
  if (!user) {
    const error = new Error('Student not found');
    error.statusCode = 404;
    throw error;
  }

  if (data.action === 'deactivate') {
    user.isActive = false;
    user.isBlocked = false;
  } else if (data.action === 'block') {
    user.isActive = false;
    user.isBlocked = true;
  } else if (data.action === 'reactivate') {
    user.isActive = true;
    user.isBlocked = false;
  } else if (data.action === 'extend_validity') {
    const currentValidity = user.validityDate || new Date();
    currentValidity.setDate(currentValidity.getDate() + data.extendedDays);
    user.validityDate = currentValidity;
  }

  await user.save();
  const updatedUser = user.toObject();
  delete updatedUser.password;
  return updatedUser;
};

const resetStudentPasswordService = async (studentId) => {
  const user = await User.findById(studentId);
  if (!user) {
    const error = new Error('Student not found');
    error.statusCode = 404;
    throw error;
  }

  const plainPassword = generateRandomPassword();
  const hashedPassword = await hashPassword(plainPassword);

  user.password = hashedPassword;
  await user.save();

  const resetEmail = passwordResetTemplate(user.fullName, user.username, plainPassword);
  await sendEmail({ to: user.email, ...resetEmail });

  return { newPassword: plainPassword };
};

const updateIpsService = async (studentId, data) => {
  const user = await User.findById(studentId);
  if (!user) {
    const error = new Error('Student not found');
    error.statusCode = 404;
    throw error;
  }

  if (data.action === 'reset') {
    user.allowedIps = [];
  } else if (data.action === 'block_ip') {
    const entry = user.allowedIps.find(e => e.ip === data.ipToBlock);
    if (!entry) {
      const error = new Error('IP not found in allowed list');
      error.statusCode = 400;
      throw error;
    }
    entry.isBlocked = true;
  }

  await user.save();
  return null;
};

export {
  createStudentService,
  updateHeartbeatService,
  updateStudentStatusService,
  resetStudentPasswordService,
  updateIpsService,
};
