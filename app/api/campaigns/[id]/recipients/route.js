import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb';
import Recipient from '../../../../../models/Recipient';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 100;
    const skip = parseInt(searchParams.get('skip')) || 0;

    const query = { campaignId: id };
    
    const status = searchParams.get('status');
    if (status) query.status = status;

    const recipients = await Recipient.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Recipient.countDocuments(query);

    return NextResponse.json({ recipients, total });
  } catch (error) {
    console.error('Campaigns [id] Recipients GET API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch recipients' }, { status: 500 });
  }
}
