import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending',
    },
    isFree: {
      type: Boolean,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['not_applicable', 'payment_pending', 'paid'],
      default: 'not_applicable',
    },
    paymentAmount: {
      type: Number,
    },
    paymentReceivedAt: {
      type: Date,
    },
    meetingLink: {
      type: String,
    },
    meetingDate: {
      type: Date,
    },
    meetingTime: {
      type: String, // E.g. "14:30"
    },
    rejectionReason: {
      type: String,
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

consultationSchema.index({ student: 1, isActive: 1 });
consultationSchema.index({ status: 1, isActive: 1 });

export default mongoose.model('Consultation', consultationSchema);
