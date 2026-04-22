import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const allowedIpSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  isBlocked: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  device: { type: String },
}, { _id: false });

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ['admin', 'student'], default: 'student', required: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  username: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    
    const existing = await User.findOne({ role: 'admin' });
    if (existing) {
      console.log('Admin already exists.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 12);

    await User.create({
      role: 'admin',
      fullName: 'Admin Sir',
      username: 'admin',
      email: 'admin@lcc.com',
      password: hashedPassword,
    });

    console.log('Admin seeded successfully! Username: admin | Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin:', error);
    process.exit(1);
  }
}

seedAdmin();
