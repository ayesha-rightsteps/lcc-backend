import User from '../../../models/user.model.js';
import { comparePassword, generateTokens } from '../../../shared/index.js';

const loginService = async ({ identifier, password, ip, device }) => {
  const user = await User.findOne({
    $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }],
    isActive: true,
  }).select('+password allowedIps role lastSeen isBlocked fullName username email phone enrollmentId courseName validityDate freeConsultationUsed');

  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  if (user.isBlocked) {
    const error = new Error('Account is blocked. Please contact Admin.');
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  if (user.role === 'student') {
    const existingIpEntry = user.allowedIps.find((entry) => entry.ip === ip);

    if (existingIpEntry) {
      if (existingIpEntry.isBlocked) {
        const error = new Error('Your IP address has been blocked. Contact support.');
        error.statusCode = 403;
        throw error;
      }
    } else {
      const allowedCount = user.allowedIps.filter((entry) => !entry.isBlocked).length;
      if (allowedCount >= 2) {
        const error = new Error('IP limit reached. Account restricted to 2 locations. Contact Admin.');
        error.statusCode = 403;
        throw error;
      }
      user.allowedIps.push({ ip, device, timestamp: new Date(), isBlocked: false });
    }
  }

  user.lastSeen = new Date();
  await user.save();

  const userObject = user.toObject();
  delete userObject.password;

  const tokens = generateTokens({ userId: user._id.toString(), role: user.role });

  return { user: userObject, tokens };
};

export { loginService };
