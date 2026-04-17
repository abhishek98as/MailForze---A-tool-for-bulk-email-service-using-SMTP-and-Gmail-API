import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
  {
    smtpHost: { type: String },
    smtpPort: { type: Number },
    smtpUser: { type: String },
    smtpPass: { type: String }, // Should be encrypted in the application layer
    smtpFromEmail: { type: String },
    smtpFromName: { type: String },
    
    imapHost: { type: String },
    imapPort: { type: Number },
    imapUser: { type: String },
    imapPass: { type: String }, // Should be encrypted
    imapTls: { type: Boolean, default: true },

    companyName: { type: String },
    contactEmail: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
