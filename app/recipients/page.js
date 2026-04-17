'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const STATUS_FILTERS = ['all', 'queued', 'delivered', 'failed', 'bounced', 'opened', 'replied'];

export default function RecipientsPage() {
  const [recipients, setRecipients] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [selected, setSelected] = useState({ campaignId: '', status: '' });
  const [retrying, setRetrying] = useState(false);

  const fetchRecipients = async (camp = selected.campaignId, stat = selected.status) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100 });
      if (camp) params.set('campaignId', camp);
      if (stat && stat !== 'all') params.set('status', stat);
      // Build the right endpoint depending on whether a campaign is selected
      const url = camp ? `/api/campaigns/${camp}/recipients?${params}` : `/api/recipients?${params}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setRecipients(data.recipients || data || []);
        setTotal(data.total || (data.recipients || data).length);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetch('/api/campaigns').then(r => r.json()).then(setCampaigns).catch(console.error);
    fetchRecipients();
  }, []);

  const handleRetryFailed = async () => {
    if (!selected.campaignId) { alert('Select a campaign first'); return; }
    setRetrying(true);
    try {
      const res = await fetch('/api/send/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: selected.campaignId })
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ ${data.requeued} emails re-queued successfully!`);
        fetchRecipients(selected.campaignId, selected.status);
      }
    } catch (e) { console.error(e); alert('Retry failed'); }
    finally { setRetrying(false); }
  };

  return (
    <div className="active">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
        <select className="form-control" style={{ flex: '1 1 180px', maxWidth: '240px' }} value={selected.campaignId}
          onChange={e => { const v = e.target.value; setSelected(s => ({ ...s, campaignId: v })); fetchRecipients(v, selected.status); }}>
          <option value="">— All Campaigns —</option>
          {campaigns.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
          {STATUS_FILTERS.map(f => (
            <div key={f} className={`filter-chip ${selected.status === f || (f === 'all' && !selected.status) ? 'active' : ''}`}
              onClick={() => { const v = f === 'all' ? '' : f; setSelected(s => ({ ...s, status: v })); fetchRecipients(selected.campaignId, v); }}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </div>
          ))}
        </div>

        <button className="btn btn-danger btn-sm" onClick={handleRetryFailed} disabled={retrying || !selected.campaignId} style={{ whiteSpace: 'nowrap' }}>
          <i className="fa-solid fa-rotate-right"></i> {retrying ? 'Retrying...' : 'Retry Failed'}
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Status</th>
                <th>Sent At</th>
                <th>Opened</th>
                <th>Replied</th>
                <th>Campaign</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-6 text-[var(--text-muted)] animate-pulse">Loading recipients...</td></tr>
              ) : recipients.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-6 text-[var(--text-muted)]">No recipients found.</td></tr>
              ) : (
                recipients.map(r => (
                  <tr key={r._id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{r.name || r.email}</strong>
                      {r.name && <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)' }}>{r.email}</span>}
                    </td>
                    <td>
                      <span className={`badge ${r.status}`}>
                        <span className={`badge-dot ${r.status}`}></span>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </td>
                    <td><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}>{r.sentAt ? new Date(r.sentAt).toLocaleString() : '—'}</span></td>
                    <td>
                      {r.openedAt
                        ? <span style={{ color: 'var(--cyan)', fontSize: '11px' }}><i className="fa-solid fa-eye mr-1"></i>{new Date(r.openedAt).toLocaleTimeString()}</span>
                        : '—'}
                    </td>
                    <td>
                      {r.repliedAt
                        ? <span style={{ color: 'var(--purple)', fontSize: '11px' }}><i className="fa-solid fa-reply mr-1"></i>{new Date(r.repliedAt).toLocaleTimeString()}</span>
                        : '—'}
                    </td>
                    <td>
                      {r.campaignId ? (
                        <Link href={`/campaigns/${r.campaignId}`} style={{ color: 'var(--accent)', fontSize: '11px', textDecoration: 'none' }}>
                          <i className="fa-solid fa-arrow-up-right-from-square mr-1"></i>View
                        </Link>
                      ) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-muted)' }}>
          Showing {recipients.length} of {total} recipients
        </div>
      </div>
    </div>
  );
}
