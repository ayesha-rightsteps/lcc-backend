import crypto from 'crypto';
import User from '../../models/user.model.js';
import { AppError, hashPassword } from '../../shared/index.js';
import { sendEmail } from '../../config/email.js';

const generateUsername = async (fullName) => {
  const base = fullName.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  let isUnique = false;
  let username = '';
  
  while (!isUnique) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    username = `${base}_lcc_${randomNum}`;
    const existing = await User.findOne({ username });
    if (!existing) isUnique = true;
  }
  return username;
};

const generateRandomPassword = () => {
  return crypto.randomBytes(6).toString('hex'); // 12-char secure string
};

const generateEnrollmentId = async () => {
  let isUnique = false;
  let enrollId = '';

  while (!isUnique) {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    enrollId = `LCC-STU-${randomNum}`;
    const existing = await User.findOne({ enrollmentId: enrollId });
    if (!existing) isUnique = true;
  }
  return enrollId;
};

const createStudentService = async (adminId, data) => {
  const existingEmail = await User.findOne({ email: data.email.toLowerCase() });
  if (existingEmail) {
    throw new AppError('Email is already registered to another user', 400);
  }

  const username = await generateUsername(data.fullName);
  const plainPassword = generateRandomPassword();
  const enrollmentId = await generateEnrollmentId();

  const hashedPassword = await hashPassword(plainPassword);

  const paymentDate = data.paymentDate ? new Date(data.paymentDate) : new Date();
  
  // Calculate expiry date: payment date + course duration in days
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

  const emailHtml = `
    <h2>Welcome to LCC Academy!</h2>
    <p>Dear ${newStudent.fullName},</p>
    <p>Your enrollment has been successfully processed.</p>
    <br/>
    <p><strong>Your Login Credentials:</strong></p>
    <p>Username: <b>${username}</b></p>
    <p>Password: <b>${plainPassword}</b></p>
    <br/>
    <p>Please log in to the portal using these credentials.</p>
    <p>Note: For security reasons, your account will be restricted to a maximum of 2 devices/IP addresses.</p>
    <br/>
    <p>Best Regards,<br/>LCC Academy Team</p>
  `;

  // Fail gracefully if email configs miss but dont throw a 500 error for users
  // (We use un-awaited / catching wrap for email if we don't wanna block response)
  await sendEmail({
    to: newStudent.email,
    subject: 'LCC Academy - Your Login Credentials',
    html: emailHtml,
  });

  const studentObj = newStudent.toObject();
  delete studentObj.password;

  // We return the plain password just for the Admin response just in case the email fails.
  return {
    student: studentObj,
    credentialsGenerated: {
      username,
      password: plainPassword,
    }
  };
};

export { createStudentService };

const updateHeartbeatService = async (userId, data) => {
  await User.findByIdAndUpdate(userId, {
    lastSeen: new Date(),
    ...(data.lat && { lastLat: data.lat }),
    ...(data.lng && { lastLng: data.lng })
  });
  return null;
};

const updateStudentStatusService = async (studentId, data) => {
  const user = await User.findById(studentId);
  if (!user) throw new AppError('Student not found', 404);

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
  if (!user) throw new AppError('Student not found', 404);

  const plainPassword = generateRandomPassword();
  const hashedPassword = await hashPassword(plainPassword);

  user.password = hashedPassword;
  await user.save();

  const emailHtml = `
    <h2>LCC Academy - Security Update</h2>
    <p>Dear ${user.fullName},</p>
    <p>Your password has been reset by the Admin.</p>
    <br/>
    <p><strong>Your New Credentials:</strong></p>
    <p>Username: <b>${user.username}</b></p>
    <p>New Password: <b>${plainPassword}</b></p>
    <br/>
    <p>Best Regards,<br/>LCC Academy Team</p>
  `;

  await sendEmail({
    to: user.email,
    subject: 'LCC Academy - Your Password Has Been Reset',
    html: emailHtml,
  });

  return { newPassword: plainPassword };
};

const updateIpsService = async (studentId, data) => {
  const user = await User.findById(studentId);
  if (!user) throw new AppError('Student not found', 404);

  if (data.action === 'reset') {
    user.allowedIps = [];
  } else if (data.action === 'block_ip') {
    const entry = user.allowedIps.find(e => e.ip === data.ipToBlock);
    if (!entry) {
      throw new AppError('IP not found in allowed list', 400);
    }
    entry.isBlocked = true;
  }

  await user.save();
  return null;
};

export { updateHeartbeatService, updateStudentStatusService, resetStudentPasswordService, updateIpsService };
