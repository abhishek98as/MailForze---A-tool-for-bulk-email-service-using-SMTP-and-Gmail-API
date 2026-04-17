import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import EmailLog from '../../../models/EmailLog';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 100;
    const skip = parseInt(searchParams.get('skip')) || 0;
    const type = searchParams.get('type');

    const query = type ? { type } : {};
    const logs = await EmailLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('campaignId', 'name subject')
      .populate('recipientId', 'email name');

    const total = await EmailLog.countDocuments(query);

    return NextResponse.json({ logs, total });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}
