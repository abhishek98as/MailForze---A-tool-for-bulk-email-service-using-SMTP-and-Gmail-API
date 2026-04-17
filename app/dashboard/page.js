'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        const data = await res.json();
        if (!res.ok || data.error) { setError(true); return; }
        setStats(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-[var(--text-muted)] animate-pulse">Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <i className="fa-solid fa-database" style={{ fontSize: '40px', color: 'var(--text-muted)', marginBottom: '16px', display: 'block', opacity: 0.4 }}></i>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Database Not Connected</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
            Please add your <code style={{ background: 'var(--bg-hover)', padding: '2px 6px', borderRadius: '4px', color: 'var(--accent)' }}>MONGODB_URI</code> to <code style={{ background: 'var(--bg-hover)', padding: '2px 6px', borderRadius: '4px' }}>.env.local</code> and restart the server.
          </div>
        </div>
      </div>
    );
  }

  const s = stats?.stats || {
    totalSent: 0,
    totalDelivered: 0,
    totalFailed: 0,
    totalReplies: 0,
    totalOpened: 0,
    deliveryRate: 0,
    bounceRate: 0,
    replyRate: 0,
    openRate: 0,
  };

  const activeCampaigns = stats?.activeCampaigns || [];
  const recentActivity = stats?.recentActivity || [];

  return (
    <div className="active">
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon-wrap blue"><i className="fa-solid fa-paper-plane"></i></div>
          <div className="stat-label">Total Sent</div>
          <div className="stat-value">{s.totalSent.toLocaleString()}</div>
          <div className="stat-change up"><i className="fa-solid fa-arrow-trend-up"></i> ---</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon-wrap green"><i className="fa-solid fa-circle-check"></i></div>
          <div className="stat-label">Delivered</div>
          <div className="stat-value">{s.totalDelivered.toLocaleString()}</div>
          <div className="stat-change up"><i className="fa-solid fa-arrow-trend-up"></i> {s.deliveryRate}% delivery rate</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon-wrap red"><i className="fa-solid fa-circle-xmark"></i></div>
          <div className="stat-label">Bounced / Failed</div>
          <div className="stat-value">{s.totalFailed.toLocaleString()}</div>
          <div className="stat-change down"><i className="fa-solid fa-arrow-trend-down"></i> {s.bounceRate}% bounce rate</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon-wrap purple"><i className="fa-solid fa-reply"></i></div>
          <div className="stat-label">Replies Received</div>
          <div className="stat-value">{s.totalReplies.toLocaleString()}</div>
          <div className="stat-change up"><i className="fa-solid fa-arrow-trend-up"></i> {s.replyRate}% reply rate</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-icon-wrap cyan"><i className="fa-solid fa-eye"></i></div>
          <div className="stat-label">Open Rate</div>
          <div className="stat-value">{s.openRate}%</div>
          <div className="stat-change up"><i className="fa-solid fa-arrow-trend-up"></i> ---</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {/* Volume Chart Placeholder */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-chart-column" style={{ color: 'var(--accent)', marginRight: '6px' }}></i>Email Volume (Last 7 Days)</div>
            <div className="btn btn-secondary btn-sm">Weekly</div>
          </div>
          <div className="card-body">
            <div className="chart-area">
              {['MON','TUE','WED','THU','FRI','SAT','SUN'].map((day, i) => (
                <div key={day} className="chart-bar-wrap">
                  <div className="chart-bar" style={{ height: `${20 + i*10}%`, background: 'linear-gradient(180deg, var(--accent), rgba(79,110,247,0.3))' }}></div>
                  <div className="chart-label">{day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-bolt" style={{ color: 'var(--warning)', marginRight: '6px' }}></i>Active Campaigns</div>
            <Link href="/campaigns" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          <div className="card-body" style={{ padding: '14px' }}>
            {activeCampaigns.length === 0 ? (
              <div className="text-center text-[var(--text-muted)] text-xs py-4">No active campaigns</div>
            ) : (
              activeCampaigns.map((camp, idx) => (
                <div key={camp._id} className="batch-row">
                  <div className="batch-num">{idx + 1}</div>
                  <div className="batch-info">
                    <div className="batch-title">{camp.name}</div>
                    <div className="batch-sub">{camp.totalRecipients} recipients · {camp.status}</div>
                  </div>
                  <span className={`badge ${camp.status === 'sending' ? 'sending' : 'draft'}`}>
                    {camp.status === 'sending' && <span className="badge-dot sent"></span>}
                    {camp.status.charAt(0).toUpperCase() + camp.status.slice(1)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-clock-rotate-left" style={{ color: 'var(--purple)', marginRight: '6px' }}></i>Recent Email Activity</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <div className="filter-chip active">All</div>
            <div className="filter-chip">Sent</div>
            <div className="filter-chip">Failed</div>
            <div className="filter-chip">Replied</div>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Recipient</th><th>Campaign</th><th>Status</th><th>Sent At</th><th>Opened</th><th>Replied</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.length === 0 ? (
                 <tr><td colSpan="7" className="text-center">No recent activity</td></tr>
              ) : (
                recentActivity.map(act => (
                  <tr key={act._id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{act.name || act.email}</strong><br/>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{act.email}</span>
                    </td>
                    <td>{act.campaignId?.name || 'Unknown'}</td>
                    <td><span className={`badge ${act.status === 'delivered' ? 'success' : act.status === 'failed' ? 'failed' : 'sent'}`}>
                      <span className={`badge-dot ${act.status === 'delivered' ? 'success' : act.status === 'failed' ? 'failed' : 'sent'}`}></span>
                      {act.status.charAt(0).toUpperCase() + act.status.slice(1)}
                    </span></td>
                    <td><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}>{new Date(act.sentAt || act.createdAt).toLocaleTimeString()}</span></td>
                    <td>{act.openedAt ? <><i className="fa-solid fa-eye" style={{ color: 'var(--cyan)', fontSize: '11px' }}></i> {new Date(act.openedAt).toLocaleTimeString()}</> : '—'}</td>
                    <td>{act.repliedAt ? <><i className="fa-solid fa-reply" style={{ color: 'var(--purple)', fontSize: '11px' }}></i> {new Date(act.repliedAt).toLocaleTimeString()}</> : '—'}</td>
                    <td><button className={`btn btn-sm ${act.status === 'failed' ? 'btn-danger' : 'btn-secondary'}`}>{act.status === 'failed' ? 'Retry' : 'View'}</button></td>
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
