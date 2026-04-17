import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Campaign from '../../../models/Campaign';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = {};
    if (status) query.status = status;

    const campaigns = await Campaign.find(query).sort({ createdAt: -1 });
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Campaigns GET API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const newCampaign = await Campaign.create({
      name: body.name,
      subject: body.subject,
      templateId: body.templateId || null,
      status: 'draft',
      totalRecipients: body.totalRecipients || 0,
    });

    return NextResponse.json(newCampaign, { status: 201 });
  } catch (error) {
    console.error('Campaigns POST API Error:', error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}
