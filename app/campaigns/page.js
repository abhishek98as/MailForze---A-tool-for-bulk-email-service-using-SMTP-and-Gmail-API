'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch('/api/campaigns');
        const data = await res.json();
        setCampaigns(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  return (
    <div className="active">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
        <div className="input-group" style={{ flex: '1 1 200px', minWidth: '160px' }}>
          <i className="fa-solid fa-magnifying-glass input-icon"></i>
          <input type="text" className="form-control" placeholder="Search campaigns..." style={{ paddingLeft: '36px' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
          <div className="filter-chip active">All</div>
          <div className="filter-chip">Sending</div>
          <div className="filter-chip">Completed</div>
          <div className="filter-chip">Draft</div>
          <div className="filter-chip">Failed</div>
        </div>
        <Link href="/compose" className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>
          <i className="fa-solid fa-plus"></i> New Campaign
        </Link>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Status</th>
                <th>Recipients</th>
                <th>Sent</th>
                <th>Delivered</th>
                <th>Bounced</th>
                <th>Open %</th>
                <th>Replies</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="11" className="text-center py-4 text-[var(--text-muted)] animate-pulse">Loading campaigns...</td></tr>
              ) : campaigns.length === 0 ? (
                <tr><td colSpan="11" className="text-center py-4 text-[var(--text-muted)]">No campaigns found.</td></tr>
              ) : (
                campaigns.map(camp => {
                  const openPercent = camp.totalRecipients > 0 ? Math.round((camp.openedCount / camp.totalRecipients) * 100) : 0;
                  return (
                    <tr key={camp._id}>
                      <td>
                        <strong style={{ color: 'var(--text-primary)' }}>{camp.name}</strong><br/>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Subject: {camp.subject}</span>
                      </td>
                      <td>
                        <span className={`badge ${camp.status === 'sending' ? 'sending' : camp.status === 'completed' ? 'success' : camp.status === 'failed' ? 'failed' : 'draft'}`}>
                          {camp.status === 'sending' && <span className="badge-dot sent"></span>}
                          {camp.status === 'completed' && <span className="badge-dot success"></span>}
                          {camp.status === 'failed' && <span className="badge-dot failed"></span>}
                          {camp.status.charAt(0).toUpperCase() + camp.status.slice(1)}
                        </span>
                      </td>
                      <td>{camp.totalRecipients}</td>
                      <td>{camp.sentCount}</td>
                      <td><span style={{ color: 'var(--success)' }}>{camp.deliveredCount}</span></td>
                      <td><span style={{ color: 'var(--danger)' }}>{camp.failedCount}</span></td>
                      <td>
                        {camp.totalRecipients > 0 && camp.status !== 'draft' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div className="progress-bar"><div className="progress-fill" style={{ width: `${openPercent}%`, background: 'var(--cyan)' }}></div></div>
                            <span>{openPercent}%</span>
                          </div>
                        ) : '—'}
                      </td>
                      <td>{camp.repliedCount}</td>
                      <td><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}>{new Date(camp.createdAt).toLocaleDateString()}</span></td>
                      <td style={{ display: 'flex', gap: '4px' }}>
                        <Link href={`/campaigns/${camp._id}`} className="btn btn-secondary btn-sm"><i className="fa-solid fa-eye"></i></Link>
                        {camp.status === 'sending' && (
                          <button className="btn btn-danger btn-sm" title="Pause"><i className="fa-solid fa-pause"></i></button>
                        )}
                        {camp.status === 'draft' && (
                          <Link href={`/compose?campaign=${camp._id}`} className="btn btn-secondary btn-sm" title="Edit"><i className="fa-solid fa-pen"></i></Link>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
