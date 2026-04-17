import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Campaign from '../../../../models/Campaign';
import Recipient from '../../../../models/Recipient';

export async function GET() {
  try {
    await dbConnect();

    const campaigns = await Campaign.find().sort({ createdAt: -1 }).lean();

    // Build CSV rows
    const rows = [
      ['Campaign Name', 'Subject', 'Status', 'Total Recipients', 'Sent', 'Delivered', 'Failed', 'Opened', 'Replied', 'Delivery Rate %', 'Open Rate %', 'Reply Rate %', 'Created Date'].join(',')
    ];

    for (const c of campaigns) {
      const delivery = c.sentCount > 0 ? ((c.deliveredCount / c.sentCount) * 100).toFixed(1) : '0';
      const open     = c.deliveredCount > 0 ? ((c.openedCount   / c.deliveredCount) * 100).toFixed(1) : '0';
      const reply    = c.deliveredCount > 0 ? ((c.repliedCount  / c.deliveredCount) * 100).toFixed(1) : '0';
      rows.push([
        `"${c.name}"`,
        `"${c.subject || ''}"`,
        c.status,
        c.totalRecipients,
        c.sentCount,
        c.deliveredCount,
        c.failedCount,
        c.openedCount,
        c.repliedCount,
        delivery,
        open,
        reply,
        new Date(c.createdAt).toLocaleDateString()
      ].join(','));
    }

    const csv = rows.join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="mailforge-report-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    console.error('CSV Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
