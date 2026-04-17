import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dbConnect from '../../../../lib/mongodb';
import Settings from '../../../../models/Settings';

export async function POST() {
  try {
    await dbConnect();
    const settings = await Settings.findOne();

    if (!settings || !settings.smtpHost) {
      return NextResponse.json({ success: false, error: 'SMTP not configured' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort,
      secure: settings.smtpPort === 465,
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPass,
      },
    });

    await transporter.verify();
    return NextResponse.json({ success: true, message: 'SMTP connection successful!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 200 });
  }
}
