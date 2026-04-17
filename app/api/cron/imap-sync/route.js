import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Settings from '../../../../models/Settings';
import Recipient from '../../../../models/Recipient';
import Campaign from '../../../../models/Campaign';
import EmailLog from '../../../../models/EmailLog';
import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';

export async function GET(req) {
  try {
    await dbConnect();
    const settings = await Settings.findOne();
    
    if (!settings || !settings.imapHost) {
      return NextResponse.json({ error: 'IMAP not configured' }, { status: 400 });
    }

    const config = {
      imap: {
        user: settings.imapUser,
        password: settings.imapPass,
        host: settings.imapHost,
        port: settings.imapPort,
        tls: settings.imapTls !== false,
        authTimeout: 3000,
      }
    };

    const connection = await imaps.connect(config);
    await connection.openBox('INBOX');

    // Search for unread messages
    const searchCriteria = ['UNSEEN'];
    const fetchOptions = {
      bodies: ['HEADER', 'TEXT', ''],
      markSeen: true
    };

    const messages = await connection.search(searchCriteria, fetchOptions);
    let repliesProcessed = 0;
    let bouncesProcessed = 0;

    for (const item of messages) {
      const all = item.parts.find(part => part.which === '');
      const id = item.attributes.uid;
      const idHeader = "Imap-Id: " + id + "\r\n";
      
      const parsed = await simpleParser(idHeader + all.body);
      const from = parsed.from.value[0].address.toLowerCase();
      const subject = parsed.subject || '';
      
      // Check if it's a bounce
      const isBounce = subject.toLowerCase().includes('undelivered') || 
                       subject.toLowerCase().includes('delivery status') ||
                       subject.toLowerCase().includes('postmaster');

      if (isBounce) {
        // Try to extract original recipient. Hard to do accurately without original headers, 
        // but we might look in the text. For a simple implementation, search text for any of our recipients.
        // A better way is matching the Message-ID, but for MVP we match email addresses in the bounce body.
        const recipientsList = parsed.text ? Array.from(parsed.text.matchAll(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)).map(m => m[0].toLowerCase()) : [];
        if (recipientsList.length > 0) {
          // Find matching recipient recently sent
          const bouncedRecip = await Recipient.findOne({ email: { $in: recipientsList }, status: 'delivered' }).sort({ sentAt: -1 });
          if (bouncedRecip) {
            bouncedRecip.status = 'bounced';
            await bouncedRecip.save();

            await Campaign.findByIdAndUpdate(bouncedRecip.campaignId, {
              $inc: { failedCount: 1, deliveredCount: -1 }
            });

            await EmailLog.create({
              campaignId: bouncedRecip.campaignId,
              recipientId: bouncedRecip._id,
              type: 'bounced'
            });
            bouncesProcessed++;
          }
        }
      } else {
        // Assume it's a normal reply
        // Find if this 'from' email matches any of our recipients
        const replier = await Recipient.findOne({ email: from }).sort({ sentAt: -1 });
        if (replier && !replier.repliedAt) {
          replier.repliedAt = new Date();
          await replier.save();

          await Campaign.findByIdAndUpdate(replier.campaignId, {
            $inc: { repliedCount: 1 }
          });

          await EmailLog.create({
            campaignId: replier.campaignId,
            recipientId: replier._id,
            type: 'replied'
          });
          repliesProcessed++;
        }
      }
    }

    connection.end();

    return NextResponse.json({
      success: true,
      processed: messages.length,
      replies: repliesProcessed,
      bounces: bouncesProcessed
    });
  } catch (error) {
    console.error('IMAP Sync Error:', error);
    return NextResponse.json({ error: 'IMAP Sync failed' }, { status: 500 });
  }
}
