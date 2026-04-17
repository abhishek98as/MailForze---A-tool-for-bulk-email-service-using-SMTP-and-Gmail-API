'use client';
import { useState } from 'react';

const QUICK_PROMPTS = [
  { label: '✍️ Write cold outreach', subject: 'Quick question about {Company Name}', body: '<p>Hi {{name}},</p><p>I noticed your company is doing amazing work in [industry]. I wanted to reach out about how we can help you [value proposition].</p><p>Would you be open to a 15-minute chat this week?</p><p>Best regards,<br/>Your Name</p>' },
  { label: '📦 Product launch announcement', subject: 'Introducing [Product Name] — Built for You', body: '<p>Dear {{name}},</p><p>We are thrilled to introduce our newest product — <strong>[Product Name]</strong>.</p><p>Here\'s what you get:</p><ul><li>Feature 1</li><li>Feature 2</li><li>Feature 3</li></ul><p>Click below to learn more and get early access.</p><p>Best,<br/>The Team</p>' },
  { label: '🔁 Follow-up email', subject: 'Following up on my previous email', body: '<p>Hi {{name}},</p><p>I wanted to follow up on my email from last week. I understand you are probably busy, but I believe this could be genuinely valuable for you.</p><p>Could we schedule 10 minutes this week?</p><p>Thanks,<br/>Your Name</p>' },
  { label: '🤝 Partnership proposal', subject: 'Partnership opportunity with [Your Company]', body: '<p>Hi {{name}},</p><p>I am reaching out because I see a great opportunity for our companies to collaborate. We specialize in [your specialty], and I believe partnering with [their company] could benefit both our customers.</p><p>Would you be interested in exploring this?</p>' },
];

export default function AiAssistantPage() {
  const [subject, setSubject]   = useState('');
  const [body, setBody]         = useState('');
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [tab, setTab]           = useState('analyze'); // 'analyze' | 'rewrite'

  const handleAnalyze = async () => {
    if (!subject || !body) { alert('Please enter a subject and email body.'); return; }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, bodyHtml: body })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI analysis failed');
      setResult(data);
    } catch (e) { alert(e.message); }
    finally { setLoading(false); }
  };

  const handleApply = () => {
    if (!result) return;
    if (result.suggestedSubject) setSubject(result.suggestedSubject);
    if (result.rewrittenBodyHtml) setBody(result.rewrittenBodyHtml);
    setResult(null);
  };

  const spamColor = result ? (result.spamScore <= 3 ? 'var(--success)' : result.spamScore <= 6 ? 'var(--warning)' : 'var(--danger)') : 'var(--text-muted)';

  return (
    <div className="active">
      {/* Quick Templates */}
      <div className="card mb-5">
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-bolt" style={{ color: 'var(--warning)', marginRight: '8px' }}></i>Quick Start Templates</div>
        </div>
        <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {QUICK_PROMPTS.map((p, i) => (
            <button key={i} className="btn btn-secondary btn-sm" onClick={() => { setSubject(p.subject); setBody(p.body); setResult(null); }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ gap: '20px', alignItems: 'start' }}>
        {/* Left: Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title"><i className="fa-solid fa-pen-nib" style={{ color: 'var(--accent)', marginRight: '8px' }}></i>Email Composer</div>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Subject Line</label>
                <input type="text" className="form-control" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Enter your email subject..." />
              </div>
              <div className="form-group">
                <label className="form-label">Body (HTML)</label>
                <textarea className="form-control" style={{ minHeight: '240px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}
                  value={body} onChange={e => setBody(e.target.value)}
                  placeholder="<p>Hi {{name}},</p>..."></textarea>
              </div>
              <button className="btn btn-primary w-full" onClick={handleAnalyze} disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                {loading
                  ? <><i className="fa-solid fa-spinner fa-spin"></i> Analyzing with Gemini AI...</>
                  : <><i className="fa-solid fa-wand-magic-sparkles"></i> Analyze Deliverability</>}
              </button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><i className="fa-solid fa-eye" style={{ color: 'var(--cyan)', marginRight: '8px' }}></i>Live Preview</div>
            </div>
            <div className="card-body" style={{ background: 'var(--bg-tertiary)', padding: '10px' }}>
              <div style={{ background: '#fff', color: '#222', borderRadius: '8px', padding: '16px', minHeight: '120px', fontSize: '13px', lineHeight: 1.6 }}>
                {subject && <div style={{ fontWeight: 700, borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '14px', color: '#000' }}>{subject}</div>}
                {body ? <div dangerouslySetInnerHTML={{ __html: body }} /> : <span style={{ color: '#aaa', fontSize: '12px' }}>Your email preview appears here...</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Results */}
        <div className="card" style={{ position: 'sticky', top: '84px' }}>
          <div className="card-header" style={{ background: 'linear-gradient(135deg, rgba(79,110,247,0.1), rgba(168,85,247,0.1))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="ai-icon"><i className="fa-solid fa-robot" style={{ color: '#fff', fontSize: '14px' }}></i></div>
              <div>
                <div className="ai-title">Gemini AI Analysis</div>
                <div className="ai-subtitle">Powered by Google Gemini 1.5 Flash</div>
              </div>
            </div>
          </div>
          <div className="card-body">
            {!result && !loading && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-robot" style={{ fontSize: '40px', marginBottom: '16px', display: 'block', opacity: 0.3 }}></i>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Ready to Analyze</div>
                <div style={{ fontSize: '12px' }}>Enter your email subject and body, then click &quot;Analyze Deliverability&quot; to get a spam risk score, tone assessment, and AI-optimized rewrite.</div>
              </div>
            )}
            {loading && (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '28px', color: 'var(--accent)', display: 'block', marginBottom: '12px' }}></i>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Gemini is analyzing your email...</div>
              </div>
            )}
            {result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Score + Tone */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1, padding: '14px', borderRadius: '10px', background: 'var(--bg-tertiary)', border: `1px solid ${spamColor}33`, textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: spamColor }}>{result.spamScore}/10</div>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginTop: '2px' }}>Spam Risk</div>
                    <div style={{ fontSize: '11px', marginTop: '6px', color: spamColor }}>
                      {result.spamScore <= 3 ? '✅ Looks great!' : result.spamScore <= 6 ? '⚠️ Moderate risk' : '🚨 High risk'}
                    </div>
                  </div>
                  <div style={{ flex: 1, padding: '14px', borderRadius: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>{result.tone || 'Neutral'}</div>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginTop: '4px' }}>Email Tone</div>
                  </div>
                </div>

                {/* Deliverability bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Deliverability Score</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: spamColor }}>{Math.max(0, 100 - (result.spamScore * 10))}%</span>
                  </div>
                  <div className="ai-score-bar"><div className="ai-score-fill" style={{ width: `${Math.max(0, 100 - result.spamScore * 10)}%` }}></div></div>
                </div>

                {/* Spam reasons */}
                {result.spamReasons && result.spamReasons.length > 0 && (
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--danger)', marginBottom: '8px' }}>⚠️ Issues Found</div>
                    {result.spamReasons.map((r, i) => (
                      <div key={i} className="ai-issue danger">
                        <i className="fa-solid fa-triangle-exclamation ai-issue-icon" style={{ color: 'var(--danger)' }}></i>
                        <div className="ai-issue-text">{r}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Subject */}
                {result.suggestedSubject && (
                  <div style={{ padding: '12px', background: 'var(--cyan-soft)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--cyan)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Suggested Subject</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{result.suggestedSubject}</div>
                  </div>
                )}

                {/* Rewritten preview */}
                {result.rewrittenBodyHtml && (
                  <div style={{ padding: '12px', background: 'var(--success-soft)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--success)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Rewritten Body (Preview)</div>
                    <div style={{ background: '#fff', color: '#000', borderRadius: '6px', padding: '10px', fontSize: '12px', maxHeight: '140px', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: result.rewrittenBodyHtml }}></div>
                  </div>
                )}

                <button className="btn btn-primary" onClick={handleApply} style={{ width: '100%', justifyContent: 'center' }}>
                  <i className="fa-solid fa-wand-magic-sparkles"></i> Apply AI Suggestions to Editor
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setResult(null)} style={{ width: '100%', justifyContent: 'center' }}>
                  Clear Results
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
