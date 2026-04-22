import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/user.model.js';
dotenv.config();
mongoose.connect(process.env.MONGODB_URL).then(async () => {
  const admin = await User.findOne({ role: 'admin' });
  console.log('Admin isActive:', admin.isActive);
  console.log('Admin isBlocked:', admin.isBlocked);
  process.exit(0);
});
