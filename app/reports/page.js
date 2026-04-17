'use client';
import { useEffect, useState } from 'react';

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/reports');
        if (res.ok) setData(await res.json());
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/reports/export');
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mailforge-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) { alert('Export failed: ' + e.message); }
    finally { setIsExporting(false); }
  };

  if (loading) return <div className="p-8 text-center text-[var(--text-muted)] animate-pulse">Loading reports...</div>;

  const totals = data?.totals || {};
  const daily = data?.daily || [];
  const recentCampaigns = data?.recentCampaigns || [];
  const statusDist = data?.statusDist || [];

  const maxSent = Math.max(...daily.map(d => d.totalSent), 1);

  const deliveryRate = totals.totalSent > 0 ? Math.round((totals.totalDelivered / totals.totalSent) * 100) : 0;
  const openRate = totals.totalDelivered > 0 ? Math.round((totals.totalOpened / totals.totalDelivered) * 100) : 0;
  const replyRate = totals.totalDelivered > 0 ? Math.round((totals.totalReplied / totals.totalDelivered) * 100) : 0;

  return (
    <div className="active">
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>All-time performance across all campaigns</div>
        <button className="btn btn-secondary btn-sm" onClick={handleExport} disabled={isExporting}>
          <i className="fa-solid fa-download"></i> {isExporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card blue">
          <div className="stat-icon-wrap blue"><i className="fa-solid fa-layer-group"></i></div>
          <div className="stat-label">Campaigns</div>
          <div className="stat-value">{totals.totalCampaigns || 0}</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon-wrap blue"><i className="fa-solid fa-paper-plane"></i></div>
          <div className="stat-label">Emails Sent</div>
          <div className="stat-value">{(totals.totalSent || 0).toLocaleString()}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon-wrap green"><i className="fa-solid fa-circle-check"></i></div>
          <div className="stat-label">Delivery Rate</div>
          <div className="stat-value">{deliveryRate}%</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-icon-wrap cyan"><i className="fa-solid fa-eye"></i></div>
          <div className="stat-label">Open Rate</div>
          <div className="stat-value">{openRate}%</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon-wrap purple"><i className="fa-solid fa-reply"></i></div>
          <div className="stat-label">Reply Rate</div>
          <div className="stat-value">{replyRate}%</div>
        </div>
      </div>

      <div className="grid-2 mb-6" style={{ gap: '16px' }}>
        {/* Daily Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-chart-line" style={{ color: 'var(--accent)', marginRight: '8px' }}></i>Daily Send Volume (Last 14 Days)</div>
          </div>
          <div className="card-body">
            {daily.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-muted)] text-sm">No data yet</div>
            ) : (
              <div className="chart-area">
                {daily.map((d, i) => (
                  <div key={i} className="chart-bar-wrap">
                    <div className="chart-bar" style={{ height: `${Math.round((d.totalSent / maxSent) * 100)}%`, background: 'linear-gradient(180deg, var(--accent), rgba(79,110,247,0.3))' }}></div>
                    <div className="chart-label">{d._id.slice(5)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-chart-pie" style={{ color: 'var(--purple)', marginRight: '8px' }}></i>Campaign Status</div>
          </div>
          <div className="card-body">
            {statusDist.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-muted)] text-sm">No campaigns yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {statusDist.map(s => {
                  const colors = { completed: 'var(--success)', sending: 'var(--accent)', draft: 'var(--text-muted)', failed: 'var(--danger)' };
                  const total = statusDist.reduce((a, b) => a + b.count, 0);
                  const pct = Math.round((s.count / total) * 100);
                  return (
                    <div key={s._id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{s._id}</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: colors[s._id] || 'var(--text-primary)' }}>{s.count}</span>
                      </div>
                      <div className="progress-bar" style={{ width: '100%', height: '6px' }}>
                        <div className="progress-fill" style={{ width: `${pct}%`, background: colors[s._id] || 'var(--accent)' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Campaigns Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-clock-rotate-left" style={{ color: 'var(--cyan)', marginRight: '8px' }}></i>Campaign Breakdown</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Status</th>
                <th>Recipients</th>
                <th>Sent</th>
                <th>Delivered</th>
                <th>Opened</th>
                <th>Replied</th>
                <th>Failed</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentCampaigns.length === 0 ? (
                <tr><td colSpan="9" className="text-center py-6 text-[var(--text-muted)]">No campaigns found.</td></tr>
              ) : (
                recentCampaigns.map(c => (
                  <tr key={c._id}>
                    <td><strong style={{ color: 'var(--text-primary)' }}>{c.name}</strong></td>
                    <td><span className={`badge ${c.status}`}>{c.status}</span></td>
                    <td>{c.totalRecipients}</td>
                    <td>{c.sentCount}</td>
                    <td style={{ color: 'var(--success)' }}>{c.deliveredCount}</td>
                    <td style={{ color: 'var(--cyan)' }}>{c.openedCount}</td>
                    <td style={{ color: 'var(--purple)' }}>{c.repliedCount}</td>
                    <td style={{ color: 'var(--danger)' }}>{c.failedCount}</td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
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
