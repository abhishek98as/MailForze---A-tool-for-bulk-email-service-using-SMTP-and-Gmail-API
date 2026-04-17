import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    subject:  { type: String, required: true },
    bodyHtml: { type: String, default: '' },           // HTML email body
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
    status: {
      type: String,
      enum: ['draft', 'sending', 'completed', 'paused', 'failed'],
      default: 'draft',
    },
    totalRecipients: { type: Number, default: 0 },
    sentCount:       { type: Number, default: 0 },
    deliveredCount:  { type: Number, default: 0 },
    failedCount:     { type: Number, default: 0 },
    openedCount:     { type: Number, default: 0 },
    repliedCount:    { type: Number, default: 0 },
    batchSize:       { type: Number, default: 50 },
  },
  { timestamps: true }
);

export default mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);
