import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Template from '../../../models/Template';

export async function GET() {
  try {
    await dbConnect();
    const templates = await Template.find().sort({ createdAt: -1 });
    return NextResponse.json(templates);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const template = await Template.create(body);
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}
