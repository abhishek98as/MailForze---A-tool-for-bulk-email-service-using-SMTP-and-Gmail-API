'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CampaignDetailsPage({ params }) {
  const { id } = params;
  const [campaign, setCampaign] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [campRes, recRes] = await Promise.all([
          fetch(`/api/campaigns/${id}`),
          fetch(`/api/campaigns/${id}/recipients?limit=50`)
        ]);
        
        if (campRes.ok) setCampaign(await campRes.json());
        if (recRes.ok) {
          const rData = await recRes.json();
          setRecipients(rData.recipients || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-[var(--text-muted)] animate-pulse">Loading campaign details...</div>;
  }

  if (!campaign) {
    return <div className="p-8 text-[var(--danger)]">Campaign not found.</div>;
  }

  const openPercent = campaign.totalRecipients > 0 ? Math.round((campaign.openedCount / campaign.totalRecipients) * 100) : 0;

  return (
    <div className="active">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">{campaign.name}</h2>
          <div className="text-xs text-[var(--text-muted)] mt-1">Subject: {campaign.subject}</div>
        </div>
        <div className="flex gap-2">
           <Link href="/campaigns" className="btn btn-secondary btn-sm"><i className="fa-solid fa-arrow-left"></i> Back to Campaigns</Link>
           {campaign.status === 'draft' && (
             <Link href={`/compose?campaign=${campaign._id}`} className="btn btn-primary btn-sm"><i className="fa-solid fa-pen"></i> Edit Campaign</Link>
           )}
        </div>
      </div>

      <div className="stats-grid mb-6">
        <div className="stat-card blue">
          <div className="stat-icon-wrap blue"><i className="fa-solid fa-paper-plane"></i></div>
          <div className="stat-label">Total Sent</div>
          <div className="stat-value">{campaign.sentCount}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon-wrap green"><i className="fa-solid fa-circle-check"></i></div>
          <div className="stat-label">Delivered</div>
          <div className="stat-value">{campaign.deliveredCount}</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon-wrap red"><i className="fa-solid fa-circle-xmark"></i></div>
          <div className="stat-label">Failed/Bounced</div>
          <div className="stat-value">{campaign.failedCount}</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon-wrap purple"><i className="fa-solid fa-reply"></i></div>
          <div className="stat-label">Replies Received</div>
          <div className="stat-value">{campaign.repliedCount}</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-icon-wrap cyan"><i className="fa-solid fa-eye"></i></div>
          <div className="stat-label">Open Rate</div>
          <div className="stat-value">{openPercent}%</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-users" style={{ color: 'var(--accent)', marginRight: '6px' }}></i>Recipients (First 50)</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Status</th>
                <th>Sent At</th>
                <th>Opened</th>
                <th>Replied</th>
              </tr>
            </thead>
            <tbody>
              {recipients.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-[var(--text-muted)]">No recipients found.</td></tr>
              ) : (
                recipients.map(act => (
                  <tr key={act._id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{act.name || act.email}</strong><br/>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{act.email}</span>
                    </td>
                    <td>
                      <span className={`badge ${act.status === 'delivered' ? 'success' : act.status === 'failed' ? 'failed' : act.status === 'bounced' ? 'bounced' : 'sent'}`}>
                        {act.status.charAt(0).toUpperCase() + act.status.slice(1)}
                      </span>
                    </td>
                    <td><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}>{act.sentAt ? new Date(act.sentAt).toLocaleString() : '—'}</span></td>
                    <td>{act.openedAt ? <><i className="fa-solid fa-eye" style={{ color: 'var(--cyan)', fontSize: '11px' }}></i> {new Date(act.openedAt).toLocaleTimeString()}</> : '—'}</td>
                    <td>{act.repliedAt ? <><i className="fa-solid fa-reply" style={{ color: 'var(--purple)', fontSize: '11px' }}></i> {new Date(act.repliedAt).toLocaleTimeString()}</> : '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
