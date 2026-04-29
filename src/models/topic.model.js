import mongoose from 'mongoose';

const TOPIC_NAMES = ['Initial Test', 'Interview', 'ISSB'];

const topicSchema = new mongoose.Schema(
  {
    name: { type: String, enum: TOPIC_NAMES, required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

topicSchema.index({ subcategory: 1, isActive: 1 });

export { TOPIC_NAMES };
export default mongoose.model('Topic', topicSchema);
