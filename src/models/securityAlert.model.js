import mongoose from 'mongoose';

const securityAlertSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    alertType: {
      type: String,
      enum: [
        'screenshot_attempt',
        'screen_recording',
        'dev_tools_opened',
        'suspicious_activity',
        'new_ip_login_attempt',
      ],
      required: true,
    },
    description: {
      type: String,
    },
    ip: {
      type: String,
    },
    device: {
      type: String,
    },
    isReviewed: {
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

securityAlertSchema.index({ student: 1, isReviewed: 1 });
securityAlertSchema.index({ createdAt: -1 });

export default mongoose.model('SecurityAlert', securityAlertSchema);
