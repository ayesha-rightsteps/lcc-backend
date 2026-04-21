import User from '../../models/user.model.js';
import { AppError } from '../../shared/index.js';
import { comparePassword, generateTokens } from '../../shared/index.js';

const loginService = async ({ identifier, password, ip, device }) => {
  const user = await User.findOne({
    $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }],
  }).select('+password');

  if (!user) {
    const err = new AppError('Invalid credentials', 401);
    throw err;
  }

  if (!user.isActive) {
    const err = new AppError('Account is deactivated. Please contact Admin.', 403);
    throw err;
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    const err = new AppError('Invalid credentials', 401);
    throw err;
  }

  // --- IP Locking Logic for Students ---
  if (user.role === 'student') {
    // Check if IP is already in allowed list
    const existingIpEntry = user.allowedIps.find((entry) => entry.ip === ip);

    if (existingIpEntry) {
      if (existingIpEntry.isBlocked) {
        const err = new AppError('Your IP address has been blocked by Admin. Contact support.', 403);
        throw err;
      }
      // Allowed IP found - do nothing (just authenticate)
    } else {
      // New IP address
      const allowedCount = user.allowedIps.filter((entry) => !entry.isBlocked).length;
      
      if (allowedCount >= 2) {
        const err = new AppError('IP limit reached. Your account is restricted to 2 locations. Please contact Admin.', 403);
        throw err;
      }

      // Add to allowed list
      user.allowedIps.push({ ip, device, timestamp: new Date(), isBlocked: false });
    }
  }

  // Update session tracking
  user.lastSeen = new Date();
  await user.save();

  // Strip password for the response
  const userObject = user.toObject();
  delete userObject.password;

  const tokens = generateTokens({ userId: user._id, role: user.role });

  return { user: userObject, tokens };
};

export { loginService };
