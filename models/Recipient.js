import mongoose from 'mongoose';

const RecipientSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    email: { type: String, required: true },
    name: { type: String },
    company: { type: String },
    customData: { type: mongoose.Schema.Types.Mixed }, // flexible JSON object for template variables
    status: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'failed', 'bounced', 'opened', 'replied'],
      default: 'pending',
    },
    messageId: { type: String }, // SMTP Message-ID for tracking
    sentAt: { type: Date },
    openedAt: { type: Date },
    repliedAt: { type: Date },
  },
  { timestamps: true }
);

// Index messageId for tracking incoming IMAP replies/bounces
RecipientSchema.index({ messageId: 1 });
RecipientSchema.index({ campaignId: 1 });

export default mongoose.models.Recipient || mongoose.model('Recipient', RecipientSchema);
