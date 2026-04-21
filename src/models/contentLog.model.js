import mongoose from 'mongoose';

const contentLogSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
    },
    ip: {
      type: String,
    },
    device: {
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

contentLogSchema.index({ student: 1, content: 1 });
contentLogSchema.index({ createdAt: -1 });

export default mongoose.model('ContentLog', contentLogSchema);
