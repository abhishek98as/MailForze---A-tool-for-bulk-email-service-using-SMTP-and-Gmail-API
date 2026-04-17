import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Recipient from '../../../../models/Recipient';
import Campaign from '../../../../models/Campaign';

export async function POST(req) {
  try {
    await dbConnect();
    const { campaignId } = await req.json();

    // Re-queue all failed recipients
    const result = await Recipient.updateMany(
      { campaignId, status: { $in: ['failed', 'bounced'] } },
      { $set: { status: 'queued', sentAt: null } }
    );

    if (result.modifiedCount > 0) {
      // Reset campaign counts
      await Campaign.findByIdAndUpdate(campaignId, {
        status: 'sending',
        $inc: {
          failedCount: -result.modifiedCount,
          sentCount: -result.modifiedCount
        }
      });
    }

    return NextResponse.json({ success: true, requeued: result.modifiedCount });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retry' }, { status: 500 });
  }
}
