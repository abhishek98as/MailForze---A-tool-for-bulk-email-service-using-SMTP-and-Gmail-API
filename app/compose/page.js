'use client';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';

export default function ComposePage() {
  const router = useRouter();
  const [mode, setMode] = useState('bulk'); // 'bulk' or 'single'
  const [formData, setFormData] = useState({
    name: 'New Campaign',
    subject: '',
    bodyHtml: '',
    singleTo: '',
    cc: '',
    bcc: '',
    batchSize: 50,
  });
  
  const [recipients, setRecipients] = useState([]);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!formData.subject || !formData.bodyHtml) {
      alert("Please enter subject and body to analyze.");
      return;
    }
    setIsAnalyzing(true);
    setAiResult(null);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: formData.subject, bodyHtml: formData.bodyHtml })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setAiResult(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyAiSuggestion = () => {
    if (aiResult) {
      setFormData({
        ...formData,
        subject: aiResult.suggestedSubject || formData.subject,
        bodyHtml: aiResult.rewrittenBodyHtml || formData.bodyHtml
      });
      setAiResult(null); // Clear once applied
      alert("AI suggestions applied to your composition!");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      const parsedRecipients = data.map(row => {
        // Try to find email key
        const emailKey = Object.keys(row).find(k => k.toLowerCase().includes('email'));
        const nameKey = Object.keys(row).find(k => k.toLowerCase().includes('name'));
        
        return {
          email: row[emailKey] || '',
          name: row[nameKey] || '',
          customData: row
        };
      }).filter(r => r.email && r.email.includes('@')); // basic validation filter

      setRecipients(parsedRecipients);
    };
    reader.readAsBinaryString(file);
  };

  const handleSend = async () => {
    if (!formData.subject || !formData.bodyHtml) {
      alert("Please fill in subject and body.");
      return;
    }

    let finalRecipients = [];
    if (mode === 'single') {
      if (!formData.singleTo) { alert("Please enter recipient email."); return; }
      finalRecipients = [{ email: formData.singleTo }];
    } else {
      if (recipients.length === 0) { alert("Please upload a valid Excel file with recipients."); return; }
      finalRecipients = recipients;
    }

    setIsSubmitting(true);
    try {
      // Create campaign
      const campRes = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          subject: formData.subject,
          totalRecipients: finalRecipients.length,
        })
      });
      
      if (!campRes.ok) throw new Error("Failed to create campaign");
      const campaign = await campRes.json();

      // Trigger bulk send process (creates recipients and starts queue)
      const bulkRes = await fetch('/api/send/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaign._id,
          recipients: finalRecipients,
          bodyHtml: formData.bodyHtml,
          batchSize: formData.batchSize,
          subject: formData.subject,
        })
      });

      if (!bulkRes.ok) throw new Error("Failed to start bulk sending");
      
      router.push(`/campaigns/${campaign._id}`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="active">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
        <div className={`mode-tab ${mode === 'bulk' ? 'active' : ''}`} onClick={() => setMode('bulk')}><i className="fa-solid fa-users"></i> Bulk Email</div>
        <div className={`mode-tab ${mode === 'single' ? 'active' : ''}`} onClick={() => setMode('single')}><i className="fa-solid fa-user"></i> Single Email</div>
      </div>

      <div className="grid-2" style={{ gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {mode === 'bulk' && (
            <div className="card">
              <div className="card-header">
                <div className="card-title"><i className="fa-solid fa-file-excel" style={{ color: 'var(--success)', marginRight: '8px' }}></i>Import Recipients</div>
              </div>
              <div className="card-body">
                <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="form-control mb-4" />
                {fileName && (
                  <div style={{ marginTop: '14px', padding: '12px', background: 'var(--success-soft)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>{fileName}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{recipients.length} valid emails loaded</div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-header">
              <div className="card-title"><i className="fa-solid fa-pen-nib" style={{ color: 'var(--accent)', marginRight: '8px' }}></i>Email Composition</div>
            </div>
            <div className="card-body">
              
              {mode === 'single' && (
                <div className="form-group">
                  <label className="form-label">To <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <div className="input-group">
                    <i className="fa-solid fa-at input-icon"></i>
                    <input type="email" className="form-control" placeholder="recipient@example.com" value={formData.singleTo} onChange={e => setFormData({...formData, singleTo: e.target.value})} />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Campaign Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="form-group">
                <label className="form-label">Subject Line <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="text" className="form-control" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
              </div>

              <div className="form-group">
                <label className="form-label">Email Body (HTML supported)</label>
                <textarea className="form-control" style={{ minHeight: '160px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }} value={formData.bodyHtml} onChange={e => setFormData({...formData, bodyHtml: e.target.value})}></textarea>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleSend} disabled={isSubmitting}>
              <i className="fa-solid fa-paper-plane"></i> {isSubmitting ? 'Sending...' : `Send ${mode === 'bulk' ? recipients.length : 1} Emails`}
            </button>
          </div>
        </div>

        {/* AI Analyzer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
           <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div className="card-title"><i className="fa-solid fa-wand-magic-sparkles" style={{ color: 'var(--purple)', marginRight: '8px' }}></i> AI Smart Analyzer</div>
               <button className="btn btn-secondary btn-sm" onClick={handleAnalyze} disabled={isAnalyzing}>
                 {isAnalyzing ? (<span><i className="fa-solid fa-spinner fa-spin"></i> Analyzing...</span>) : 'Analyze Deliverability'}
               </button>
             </div>
             <div className="card-body">
               {aiResult ? (
                 <div className="bg-[var(--bg-tertiary)] p-4 rounded-md">
                   <div className="flex gap-4 mb-4">
                     <div className={`p-3 rounded-lg text-center flex-1 ${aiResult.spamScore > 5 ? 'bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger)]' : 'bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]'}`}>
                       <div className="text-2xl font-bold">{aiResult.spamScore}/10</div>
                       <div className="text-xs uppercase tracking-wider">Spam Risk</div>
                     </div>
                     <div className="p-3 rounded-lg text-center flex-1 bg-[var(--bg-secondary)] border border-[var(--border)]">
                       <div className="text-lg font-bold text-[var(--text-primary)] mt-1">{aiResult.tone || 'Neutral'}</div>
                       <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] mt-1">Tone</div>
                     </div>
                   </div>

                   {aiResult.spamReasons && aiResult.spamReasons.length > 0 && (
                     <div className="mb-4">
                       <strong className="text-sm text-[var(--danger)] block mb-1">Spam Triggers Found:</strong>
                       <ul className="list-disc pl-4 text-xs text-[var(--text-secondary)]">
                         {aiResult.spamReasons.map((r, i) => <li key={i}>{r}</li>)}
                       </ul>
                     </div>
                   )}

                   {aiResult.suggestedSubject && (
                     <div className="mb-4">
                       <strong className="text-sm text-[var(--cyan)] block mb-1">Suggested Subject:</strong>
                       <div className="bg-[#1e2436] p-2 rounded text-xs">{aiResult.suggestedSubject}</div>
                     </div>
                   )}

                   {aiResult.rewrittenBodyHtml && (
                     <div className="mb-4">
                       <strong className="text-sm text-[var(--success)] block mb-1">AI Rewritten Body:</strong>
                       <div className="bg-[#1e2436] p-2 rounded text-xs max-h-40 overflow-y-auto" dangerouslySetInnerHTML={{__html: aiResult.rewrittenBodyHtml}}></div>
                     </div>
                   )}

                   <button className="btn btn-primary w-full mt-2" onClick={handleApplyAiSuggestion}>
                     <i className="fa-solid fa-check"></i> Apply AI Suggestions
                   </button>
                 </div>
               ) : (
                 <div className="text-center p-8 text-[var(--text-muted)] text-sm">
                   <i className="fa-solid fa-robot text-3xl mb-2 block opacity-50"></i>
                   Enter subject and body, then click "Analyze" to see spam score and AI-optimized rewrites.
                 </div>
               )}
             </div>
           </div>

           <div className="card">
             <div className="card-header">
               <div className="card-title"><i className="fa-solid fa-eye" style={{ color: 'var(--cyan)', marginRight: '8px' }}></i> Live Preview</div>
             </div>
             <div className="card-body bg-[var(--bg-tertiary)] p-4">
               <div className="bg-white text-black rounded p-4 text-sm" style={{ minHeight: '150px' }}>
                 <strong>Subject:</strong> {formData.subject}<hr className="my-2 border-gray-200" />
                 <div dangerouslySetInnerHTML={{ __html: formData.bodyHtml }}></div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
