import mongoose from 'mongoose';

const studentAccessSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

studentAccessSchema.index({ student: 1, topic: 1 }, { unique: true });
studentAccessSchema.index({ student: 1, isActive: 1 });

export default mongoose.model('StudentAccess', studentAccessSchema);
