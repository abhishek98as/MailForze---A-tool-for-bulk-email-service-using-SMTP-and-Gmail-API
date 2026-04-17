import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Recipient from '../../../../models/Recipient';
import Campaign from '../../../../models/Campaign';
import Settings from '../../../../models/Settings';
import EmailLog from '../../../../models/EmailLog';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    await dbConnect();

    // Check if there are queued recipients
    const queuedRecipients = await Recipient.find({ status: 'queued' }).limit(10).populate('campaignId');
    if (!queuedRecipients || queuedRecipients.length === 0) {
      // Check if campaigns need status update
      await Campaign.updateMany(
        { status: 'sending', $expr: { $eq: ['$sentCount', '$totalRecipients'] } },
        { status: 'completed' }
      );
      return NextResponse.json({ message: 'No queued emails found', sending: false });
    }

    const settings = await Settings.findOne();
    if (!settings || !settings.smtpHost) {
      return NextResponse.json({ error: 'SMTP settings not configured' }, { status: 400 });
    }

    // Initialize transporter
    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort,
      secure: settings.smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPass, // TODO: decryption
      },
    });

    let successCount = 0;
    let failCount = 0;

    for (const recipient of queuedRecipients) {
      const campaign = recipient.campaignId;
      if (!campaign || campaign.status !== 'sending') {
        recipient.status = 'failed';
        await recipient.save();
        failCount++;
        continue;
      }

      try {
        let finalHtml = campaign.bodyHtml || '';
        // Basic merge tags replacement
        finalHtml = finalHtml.replace(/{{name}}/g, recipient.name || 'User');
        finalHtml = finalHtml.replace(/{{email}}/g, recipient.email);

        // Add tracking pixel
        const trackingPixel = `<img src="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/track?c=${campaign._id}&r=${recipient._id}" width="1" height="1" alt="" style="display:none" />`;
        finalHtml += trackingPixel;

        await transporter.sendMail({
          from: `"${settings.smtpFromName || 'MailForge Pro'}" <${settings.smtpFromEmail || settings.smtpUser}>`,
          to: recipient.email,
          subject: campaign.subject,
          html: finalHtml,
        });

        // Update recipient
        recipient.status = 'delivered';
        recipient.sentAt = new Date();
        await recipient.save();

        // Increment campaign counts
        await Campaign.findByIdAndUpdate(campaign._id, {
          $inc: { sentCount: 1, deliveredCount: 1 }
        });

        successCount++;
        
        // Log it
        await EmailLog.create({
          campaignId: campaign._id,
          recipientId: recipient._id,
          type: 'sent',
        });
      } catch (err) {
        console.error('Failed to send to', recipient.email, err);
        recipient.status = 'failed';
        await recipient.save();

        await Campaign.findByIdAndUpdate(campaign._id, {
          $inc: { sentCount: 1, failedCount: 1 }
        });

        await EmailLog.create({
          campaignId: campaign._id,
          recipientId: recipient._id,
          type: 'bounced', // using bounced as generic failure for now
        });
        failCount++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: queuedRecipients.length,
      delivered: successCount,
      failed: failCount
    });
  } catch (error) {
    console.error('Batch send error:', error);
    return NextResponse.json({ error: 'Failed to process batch' }, { status: 500 });
  }
}
