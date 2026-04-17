import mongoose from 'mongoose';

const TemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    bodyHtml: { type: String, required: true },
    bodyText: { type: String }, // Optional fallback
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Template || mongoose.model('Template', TemplateSchema);
