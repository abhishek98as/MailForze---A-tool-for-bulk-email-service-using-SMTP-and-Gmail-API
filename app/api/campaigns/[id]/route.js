import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Campaign from '../../../../models/Campaign';
import Recipient from '../../../../models/Recipient';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // You might also want to fetch some stats specific to the campaign here if needed
    // or just return the campaign object

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Campaigns [id] GET API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await req.json();

    const campaign = await Campaign.findByIdAndUpdate(id, body, { new: true });
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Campaigns [id] PUT API Error:', error);
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const campaign = await Campaign.findByIdAndDelete(id);
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Optionally delete all recipients related to this campaign
    await Recipient.deleteMany({ campaignId: id });

    return NextResponse.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Campaigns [id] DELETE API Error:', error);
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 });
  }
}
