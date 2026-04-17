'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

const EMOJI_MAP = {
  welcome: '👋',
  promo: '🎉',
  followup: '🔄',
  newsletter: '📰',
  transactional: '🔒',
  announcement: '📢',
};

const BLANK_TEMPLATE = { name: '', subject: '', bodyHtml: '', category: 'promo', tags: '' };

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(BLANK_TEMPLATE);
  const [saving, setSaving] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const previewRef = useRef(null);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/templates');
      if (res.ok) setTemplates(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTemplates(); }, []);

  const handleSave = async () => {
    if (!form.name || !form.subject || !form.bodyHtml) {
      alert('Please fill in Name, Subject and Body.'); return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) })
      });
      if (res.ok) {
        await fetchTemplates();
        setShowModal(false);
        setForm(BLANK_TEMPLATE);
      }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="active">
      <div className="search-bar">
        <div className="input-group" style={{ flex: 1 }}>
          <i className="fa-solid fa-magnifying-glass input-icon"></i>
          <input type="text" className="form-control" placeholder="Search templates..." style={{ paddingLeft: '36px' }} />
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => { setForm(BLANK_TEMPLATE); setPreviewHtml(''); setShowModal(true); }}>
          <i className="fa-solid fa-plus"></i> New Template
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-[var(--text-muted)] animate-pulse">Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="card p-12 text-center">
          <i className="fa-solid fa-file-code text-4xl mb-3 block" style={{ color: 'var(--text-muted)' }}></i>
          <div className="font-semibold mb-1">No templates yet</div>
          <div className="text-xs text-[var(--text-muted)] mb-4">Save reusable email templates to speed up your campaigns.</div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}><i className="fa-solid fa-plus"></i> Create your first template</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: '16px' }}>
          {templates.map(t => (
            <div key={t._id} className="template-card" onClick={() => { setForm({ ...t, tags: (t.tags || []).join(', ') }); setPreviewHtml(t.bodyHtml || ''); setShowModal(true); }}>
              <div className="template-preview">
                <span style={{ fontSize: '36px', position: 'relative', zIndex: 1 }}>{EMOJI_MAP[t.category] || '📩'}</span>
              </div>
              <div className="template-info">
                <div className="template-name">{t.name}</div>
                <div className="template-meta">{t.subject}</div>
                <div className="template-tags">
                  {(t.tags || []).map((tag, i) => <span key={i} className="tag">#{tag}</span>)}
                  <span className="tag" style={{ color: 'var(--accent)', borderColor: 'rgba(79,110,247,0.3)' }}>{t.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>{form._id ? 'Edit Template' : 'New Template'}</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden' }}>
              {/* Form */}
              <div style={{ padding: '20px', borderRight: '1px solid var(--border)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Template Name *</label>
                  <input type="text" className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Welcome Email" />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject Line *</label>
                  <input type="text" className="form-control" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Hello {{name}}, welcome aboard!" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {Object.keys(EMOJI_MAP).map(k => <option key={k} value={k}>{EMOJI_MAP[k]} {k.charAt(0).toUpperCase() + k.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <input type="text" className="form-control" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="newsletter, q2, clients" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">HTML Body * <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(supports {'{{name}}'}, {'{{email}}'})</span></label>
                  <textarea className="form-control" style={{ minHeight: '200px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
                    value={form.bodyHtml}
                    onChange={e => { setForm({ ...form, bodyHtml: e.target.value }); setPreviewHtml(e.target.value); }}
                    placeholder="<p>Hello {{name}},</p><p>Your email here...</p>"
                  ></textarea>
                </div>
              </div>
              {/* Live Preview */}
              <div style={{ padding: '20px', overflowY: 'auto', background: 'var(--bg-tertiary)' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Preview</div>
                <div style={{ background: '#fff', color: '#000', borderRadius: '8px', padding: '20px', fontSize: '14px', minHeight: '300px', lineHeight: 1.6 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '16px' }}>
                    {form.subject || 'Your Subject Line'}
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: previewHtml || '<p style="color:#999">Start typing your HTML body to see a preview...</p>' }} />
                </div>
                <div style={{ marginTop: '12px', padding: '10px', background: 'var(--bg-card)', borderRadius: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--cyan)' }}>Merge Tags:</strong> Use <code style={{ background: 'var(--bg-hover)', padding: '1px 5px', borderRadius: '4px' }}>{'{{name}}'}</code> and <code style={{ background: 'var(--bg-hover)', padding: '1px 5px', borderRadius: '4px' }}>{'{{email}}'}</code> — they&apos;ll be replaced dynamically when sending.
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : <><i className="fa-solid fa-floppy-disk"></i> Save Template</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
