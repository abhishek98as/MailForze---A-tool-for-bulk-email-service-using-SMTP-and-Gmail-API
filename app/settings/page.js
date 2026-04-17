'use client';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
    smtpFromName: '',
    smtpFromEmail: '',
    imapHost: '',
    imapPort: '',
    imapUser: '',
    imapPass: '',
    imapTls: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setFormData(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleTestSmtp = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/settings/test-smtp', { method: 'POST' });
      const data = await res.json();
      setTestResult(data);
    } catch (e) {
      setTestResult({ success: false, error: e.message });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) alert('Settings saved successfully!');
      else alert('Failed to save settings.');
    } catch (err) {
      console.error(err);
      alert('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 animate-pulse text-[var(--text-muted)]">Loading settings...</div>;

  return (
    <div className="active max-w-4xl">
      <div className="card mb-6">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-paper-plane text-[var(--cyan)] mr-2"></i>SMTP Configuration (Sending emails)</div>
        </div>
        <div className="card-body">
          <div className="grid-2" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">SMTP Host</label>
              <input type="text" className="form-control" value={formData.smtpHost || ''} onChange={e => setFormData({...formData, smtpHost: e.target.value})} placeholder="smtp.gmail.com" />
            </div>
            <div className="form-group">
              <label className="form-label">SMTP Port</label>
              <input type="number" className="form-control" value={formData.smtpPort || ''} onChange={e => setFormData({...formData, smtpPort: parseInt(e.target.value)})} placeholder="465" />
            </div>
          </div>
          <div className="grid-2" style={{ gap: '16px', marginTop: '16px' }}>
            <div className="form-group">
              <label className="form-label">SMTP Username</label>
              <input type="text" className="form-control" value={formData.smtpUser || ''} onChange={e => setFormData({...formData, smtpUser: e.target.value})} placeholder="you@domain.com" />
            </div>
            <div className="form-group">
              <label className="form-label">SMTP Password</label>
              <input type="password" className="form-control" value={formData.smtpPass || ''} onChange={e => setFormData({...formData, smtpPass: e.target.value})} placeholder="App Password" />
              <div className="text-xs text-[var(--text-muted)] mt-1">Leave blank to keep current password unchanged.</div>
            </div>
          </div>
          <div className="grid-2" style={{ gap: '16px', marginTop: '16px' }}>
            <div className="form-group">
              <label className="form-label">From Name</label>
              <input type="text" className="form-control" value={formData.smtpFromName || ''} onChange={e => setFormData({...formData, smtpFromName: e.target.value})} placeholder="Your Company" />
            </div>
            <div className="form-group">
              <label className="form-label">From Email</label>
              <input type="email" className="form-control" value={formData.smtpFromEmail || ''} onChange={e => setFormData({...formData, smtpFromEmail: e.target.value})} placeholder="hello@domain.com" />
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-inbox text-[var(--purple)] mr-2"></i>IMAP Configuration (Reading replies & bounces)</div>
        </div>
        <div className="card-body">
          <div className="grid-2" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">IMAP Host</label>
              <input type="text" className="form-control" value={formData.imapHost || ''} onChange={e => setFormData({...formData, imapHost: e.target.value})} placeholder="imap.gmail.com" />
            </div>
            <div className="form-group">
              <label className="form-label">IMAP Port</label>
              <input type="number" className="form-control" value={formData.imapPort || ''} onChange={e => setFormData({...formData, imapPort: parseInt(e.target.value)})} placeholder="993" />
            </div>
          </div>
          <div className="grid-2" style={{ gap: '16px', marginTop: '16px' }}>
            <div className="form-group">
              <label className="form-label">IMAP Username</label>
              <input type="text" className="form-control" value={formData.imapUser || ''} onChange={e => setFormData({...formData, imapUser: e.target.value})} placeholder="you@domain.com" />
            </div>
            <div className="form-group">
              <label className="form-label">IMAP Password</label>
              <input type="password" className="form-control" value={formData.imapPass || ''} onChange={e => setFormData({...formData, imapPass: e.target.value})} placeholder="App Password" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input type="checkbox" id="imapTls" checked={formData.imapTls} onChange={e => setFormData({...formData, imapTls: e.target.checked})} />
            <label htmlFor="imapTls" className="text-sm">Use TLS</label>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <i className="fa-solid fa-floppy-disk"></i> {saving ? 'Saving...' : 'Save Settings'}
        </button>
        <button className="btn btn-secondary" onClick={handleTestSmtp} disabled={testing}>
          <i className="fa-solid fa-plug"></i> {testing ? 'Testing...' : 'Test SMTP Connection'}
        </button>
        {testResult && (
          <div style={{
            padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
            background: testResult.success ? 'var(--success-soft)' : 'var(--danger-soft)',
            border: `1px solid ${testResult.success ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: testResult.success ? 'var(--success)' : 'var(--danger)',
          }}>
            {testResult.success
              ? <><i className="fa-solid fa-circle-check mr-1"></i>{testResult.message}</>
              : <><i className="fa-solid fa-circle-xmark mr-1"></i>{testResult.error}</>}
          </div>
        )}
      </div>

      {/* Security note */}
      <div className="card mt-6" style={{ borderColor: 'rgba(79,110,247,0.3)', background: 'var(--accent-soft)' }}>
        <div className="card-body" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <i className="fa-solid fa-shield-halved" style={{ color: 'var(--accent)', fontSize: '20px', marginTop: '2px' }}></i>
          <div>
            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--accent)' }}>Privacy & Security Notice</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.6 }}>
              Your SMTP and IMAP credentials are stored directly in <strong>your own MongoDB Atlas database</strong> — not on any third-party server. Only you (the MongoDB owner) can access this data. 
              Use <strong>App Passwords</strong> (not your main email password) for Gmail/Outlook to minimize risk. App Passwords can be revoked at any time from your Google or Microsoft account.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
