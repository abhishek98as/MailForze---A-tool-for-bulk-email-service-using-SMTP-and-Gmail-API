import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Campaign from '../../../../models/Campaign';
import Recipient from '../../../../models/Recipient';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    // Aggregations to get overal stats
    const campaignsCount = await Campaign.countDocuments();
    
    // Total recipients
    const totalSent = await Recipient.countDocuments({ status: { $in: ['sent', 'delivered', 'opened', 'replied'] } });
    const totalDelivered = await Recipient.countDocuments({ status: { $in: ['delivered', 'opened', 'replied'] } });
    const totalFailed = await Recipient.countDocuments({ status: { $in: ['failed', 'bounced'] } });
    const totalReplies = await Recipient.countDocuments({ status: 'replied' });
    const totalOpened = await Recipient.countDocuments({ status: { $in: ['opened', 'replied'] } });

    // Active campaigns (sending or queued/draft)
    const activeCampaigns = await Campaign.find({
      status: { $in: ['sending', 'draft'] }
    }).sort({ createdAt: -1 }).limit(5);

    // Recent activity (from recipients)
    const recentActivity = await Recipient.find({
      status: { $in: ['sent', 'delivered', 'opened', 'replied', 'failed', 'bounced'] }
    })
    .populate('campaignId', 'name')
    .sort({ updatedAt: -1 })
    .limit(10);

    return NextResponse.json({
      stats: {
        totalSent,
        totalDelivered,
        totalFailed,
        totalReplies,
        totalOpened,
        deliveryRate: totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : 0,
        bounceRate: totalSent > 0 ? ((totalFailed / totalSent) * 100).toFixed(1) : 0,
        replyRate: totalSent > 0 ? ((totalReplies / totalSent) * 100).toFixed(1) : 0,
        openRate: totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : 0,
      },
      activeCampaigns,
      recentActivity,
    });
  } catch (error) {
    console.error('Dashboard Stats API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
