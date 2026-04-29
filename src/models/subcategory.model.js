import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

subcategorySchema.index({ category: 1, isActive: 1 });

export default mongoose.model('Subcategory', subcategorySchema);
