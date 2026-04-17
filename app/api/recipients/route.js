import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Recipient from '../../../models/Recipient';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const limit  = parseInt(searchParams.get('limit'))  || 100;
    const skip   = parseInt(searchParams.get('skip'))   || 0;
    const status = searchParams.get('status');
    const campaignId = searchParams.get('campaignId');

    const query = {};
    if (status)     query.status     = status;
    if (campaignId) query.campaignId = campaignId;

    const [recipients, total] = await Promise.all([
      Recipient.find(query).sort({ sentAt: -1 }).skip(skip).limit(limit),
      Recipient.countDocuments(query)
    ]);

    return NextResponse.json({ recipients, total });
  } catch (error) {
    console.error('Recipients GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch recipients' }, { status: 500 });
  }
}
