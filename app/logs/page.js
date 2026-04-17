'use client';
import { useEffect, useState } from 'react';

const LOG_ICONS = {
  sent: { icon: 'fa-paper-plane', color: 'var(--accent)' },
  delivered: { icon: 'fa-circle-check', color: 'var(--success)' },
  opened: { icon: 'fa-eye', color: 'var(--cyan)' },
  bounced: { icon: 'fa-circle-xmark', color: 'var(--warning)' },
  failed: { icon: 'fa-triangle-exclamation', color: 'var(--danger)' },
  replied: { icon: 'fa-reply', color: 'var(--purple)' },
};

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);
  const LIMIT = 50;

  const fetchLogs = async (filt = filter, pg = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: LIMIT, skip: pg * LIMIT });
      if (filt) params.set('type', filt);
      const res = await fetch(`/api/logs?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setTotal(data.total || 0);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleFilter = (f) => { setFilter(f); setPage(0); fetchLogs(f, 0); };

  return (
    <div className="active">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '16px' }}>
        {['', 'sent', 'delivered', 'opened', 'bounced', 'failed', 'replied'].map(f => (
          <div key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => handleFilter(f)}>
            {f ? <><i className={`fa-solid ${(LOG_ICONS[f] || {}).icon || 'fa-circle'}`} style={{ color: (LOG_ICONS[f] || {}).color }}></i> {f.charAt(0).toUpperCase() + f.slice(1)}</> : 'All Events'}
          </div>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{total} total</span>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Recipient</th>
                <th>Campaign</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-6 text-[var(--text-muted)] animate-pulse">Loading logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-6 text-[var(--text-muted)]">No logs found for this filter.</td></tr>
              ) : (
                logs.map(log => {
                  const meta = LOG_ICONS[log.type] || { icon: 'fa-circle', color: 'var(--text-muted)' };
                  return (
                    <tr key={log._id}>
                      <td>
                        <span className={`badge ${log.type}`} style={{ gap: '6px' }}>
                          <i className={`fa-solid ${meta.icon}`} style={{ color: meta.color, fontSize: '10px' }}></i>
                          {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                        </span>
                      </td>
                      <td>
                        {log.recipientId ? (
                          <>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{log.recipientId.name || log.recipientId.email}</span>
                            {log.recipientId.name && <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)' }}>{log.recipientId.email}</span>}
                          </>
                        ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                      </td>
                      <td>
                        {log.campaignId ? (
                          <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{log.campaignId.name || log.campaignId.subject || '—'}</span>
                        ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                      </td>
                      <td>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--text-muted)' }}>
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {total > LIMIT && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Page {page + 1} of {Math.ceil(total / LIMIT)}</span>
            <button className="btn btn-secondary btn-sm" disabled={page === 0} onClick={() => { setPage(p => p - 1); fetchLogs(filter, page - 1); }}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button className="btn btn-secondary btn-sm" disabled={(page + 1) * LIMIT >= total} onClick={() => { setPage(p => p + 1); fetchLogs(filter, page + 1); }}>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
