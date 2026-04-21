import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['pdf', 'video'],
      required: true,
    },
    driveId: {
      type: String,
      required: true,
      unique: true, // Only add a drive file once
    },
    description: {
      type: String,
    },
    grantedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

contentSchema.index({ type: 1, isActive: 1 });

export default mongoose.model('Content', contentSchema);
