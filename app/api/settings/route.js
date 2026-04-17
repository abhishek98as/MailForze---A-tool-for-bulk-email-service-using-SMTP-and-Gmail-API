import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Settings from '../../../models/Settings';

export async function GET() {
  try {
    await dbConnect();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    // Don't send passwords back to the client!
    const safeSettings = { ...settings._doc };
    delete safeSettings.smtpPass;
    delete safeSettings.imapPass;
    
    return NextResponse.json(safeSettings);
  } catch (error) {
    console.error('Settings GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // In a real app, encrypt passwords here before saving:
    // if (body.smtpPass) body.smtpPass = encrypt(body.smtpPass);
    // if (body.imapPass) body.imapPass = encrypt(body.imapPass);

    let settings = await Settings.findOne();
    if (settings) {
      Object.assign(settings, body);
      await settings.save();
    } else {
      settings = await Settings.create(body);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings POST Error:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
