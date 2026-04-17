import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Recipient from '../../../../models/Recipient';
import Campaign from '../../../../models/Campaign';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { campaignId, recipients, bodyHtml, batchSize, subject } = body;

    if (!campaignId || !recipients || !recipients.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert all recipients as draft/queued
    const docs = recipients.map(r => ({
      campaignId,
      email: r.email,
      name: r.name,
      status: 'queued',
      metadata: r.customData || {}
    }));

    await Recipient.insertMany(docs);

    // Update campaign status
    await Campaign.findByIdAndUpdate(campaignId, {
      status: 'sending',
      bodyHtml,
      subject,
      totalRecipients: recipients.length
    });

    return NextResponse.json({ success: true, count: recipients.length });
  } catch (error) {
    console.error('Bulk Send initialization error:', error);
    return NextResponse.json({ error: 'Failed to initialize bulk send' }, { status: 500 });
  }
}
