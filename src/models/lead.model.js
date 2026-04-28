import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, default: '' },
  branch: { type: String, enum: ['Pak Army', 'Pak Air Force', 'Pak Navy'], required: true },
  course: { type: String, required: true, trim: true },
  message: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);
