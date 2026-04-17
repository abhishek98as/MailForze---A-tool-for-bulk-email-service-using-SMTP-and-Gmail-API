import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Recipient from '../../../models/Recipient';
import Campaign from '../../../models/Campaign';
import EmailLog from '../../../models/EmailLog';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const c = searchParams.get('c'); // campaignId
    const r = searchParams.get('r'); // recipientId

    if (c && r) {
      await dbConnect();

      // Find recipient
      const recipient = await Recipient.findById(r);
      if (recipient && !recipient.openedAt) {
        // Mark opened
        recipient.openedAt = new Date();
        recipient.status = 'delivered'; // Ensure status is considered delivered if opened
        await recipient.save();

        // Increment campaign stat
        await Campaign.findByIdAndUpdate(c, {
          $inc: { openedCount: 1 }
        });

        // Add to email log
        await EmailLog.create({
          campaignId: c,
          recipientId: r,
          type: 'opened'
        });
      }
    }

    // Return a 1x1 transparent GIF
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );

    return new NextResponse(pixel, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Tracking pixel error:', error);
    // Still return the pixel to not break images
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    return new NextResponse(pixel, {
      status: 200,
      headers: { 'Content-Type': 'image/gif' }
    });
  }
}
