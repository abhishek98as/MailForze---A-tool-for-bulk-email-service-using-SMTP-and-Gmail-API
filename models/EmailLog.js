import mongoose from 'mongoose';

const EmailLogSchema = new mongoose.Schema(
  {
    campaignId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign',  required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipient', required: true },
    type: {
      type: String,
      enum: ['sent', 'delivered', 'bounced', 'opened', 'replied', 'failed'],
      required: true,
    },
    message: { type: String }, // Extra info (error reason, bounce message, etc.)
  },
  { timestamps: true }
);

export default mongoose.models.EmailLog || mongoose.model('EmailLog', EmailLogSchema);
