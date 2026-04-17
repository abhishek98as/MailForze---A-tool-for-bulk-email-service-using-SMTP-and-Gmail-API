import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Campaign from '../../../models/Campaign';
import Recipient from '../../../models/Recipient';

export async function GET() {
  try {
    await dbConnect();

    // Aggregate stats by day for last 14 days
    const since = new Date();
    since.setDate(since.getDate() - 14);

    const campaignStats = await Campaign.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSent: { $sum: '$sentCount' },
          totalDelivered: { $sum: '$deliveredCount' },
          totalFailed: { $sum: '$failedCount' },
          totalReplied: { $sum: '$repliedCount' },
          totalOpened: { $sum: '$openedCount' },
          campaigns: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Overall totals
    const totals = await Campaign.aggregate([
      {
        $group: {
          _id: null,
          totalSent: { $sum: '$sentCount' },
          totalDelivered: { $sum: '$deliveredCount' },
          totalFailed: { $sum: '$failedCount' },
          totalReplied: { $sum: '$repliedCount' },
          totalOpened: { $sum: '$openedCount' },
          totalCampaigns: { $sum: 1 },
          totalRecipients: { $sum: '$totalRecipients' }
        }
      }
    ]);

    // Recent campaigns for table
    const recentCampaigns = await Campaign.find()
      .sort({ createdAt: -1 })
      .limit(10);

    // Status distribution
    const statusDist = await Campaign.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    return NextResponse.json({
      daily: campaignStats,
      totals: totals[0] || {},
      recentCampaigns,
      statusDist
    });
  } catch (error) {
    console.error('Reports API error:', error);
    return NextResponse.json({ error: 'Failed to fetch report data' }, { status: 500 });
  }
}
