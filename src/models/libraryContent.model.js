import mongoose from 'mongoose';

const libraryContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    driveId: { type: String, required: true, trim: true },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

libraryContentSchema.index({ topic: 1, isActive: 1 });

export default mongoose.model('LibraryContent', libraryContentSchema);
