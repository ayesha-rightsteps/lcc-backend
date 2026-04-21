import mongoose from 'mongoose';

const allowedIpSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  isBlocked: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  device: { type: String },
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['admin', 'student'],
      default: 'student',
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true, // admin might not have a generated username
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
    },
    enrollmentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    courseName: {
      type: String,
    },
    courseDuration: {
      type: Number, // duration in days
    },
    paymentAmount: {
      type: Number,
    },
    paymentDate: {
      type: Date,
    },
    validityDate: {
      type: Date,
    },
    allowedIps: {
      type: [allowedIpSchema],
      default: [],
    },
    lastSeen: {
      type: Date,
    },
    lastLat: {
      type: Number,
    },
    lastLng: {
      type: Number,
    },
    freeConsultationUsed: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ username: 1, isActive: 1 });
userSchema.index({ enrollmentId: 1, isActive: 1 });

export default mongoose.model('User', userSchema);
