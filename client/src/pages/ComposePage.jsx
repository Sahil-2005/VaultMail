import { useState } from 'react';
import ComposeForm from '../components/email/ComposeForm';
import DraftEditor from '../components/email/DraftEditor';
import SourcePanel from '../components/email/SourcePanel';
import ApproveButton from '../components/email/ApproveButton';
import toast from 'react-hot-toast';

export default function ComposePage() {
  const [draft, setDraft] = useState(null);
  const [sources, setSources] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleGenerateDraft = async ({ prompt, to }) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/draft-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, to_email: to })
      });
      if (!res.ok) throw new Error('Failed to generate draft');
      const data = await res.json();
      setDraft(data.draft);
      setSources(data.sources);
      toast.success('Draft generated successfully');
    } catch (err) {
      toast.error(err.message || 'Error generating draft');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!draft) return;
    setIsSending(true);
    try {
      const res = await fetch('/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: draft.to,
          subject: draft.subject,
          body_html: draft.body // Depending on backend expectation
        })
      });
      if (!res.ok) throw new Error('Failed to send email');
      toast.success('Email sent successfully!');
      setDraft(null);
      setSources([]);
    } catch (err) {
      toast.error(err.message || 'Error sending email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Compose Email</h1>
        <p className="text-slate-400">Ask the AI agent to draft an email based on your vault contents.</p>
      </div>

      {!draft && (
        <div className="glass-panel p-6 rounded-xl border border-slate-700">
          <ComposeForm onGenerate={handleGenerateDraft} isLoading={isGenerating} />
        </div>
      )}

      {draft && (
        <div className="flex gap-6 h-full min-h-[500px]">
          <div className="flex-1 flex flex-col gap-4">
            <div className="glass-panel p-6 rounded-xl border border-slate-700 flex-1 flex flex-col">
              <DraftEditor draft={draft} setDraft={setDraft} />
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => {
                  setDraft(null);
                  setSources([]);
                }}
                className="px-4 py-2 text-slate-400 hover:text-white mr-4"
                disabled={isSending}
              >
                Discard
              </button>
              <ApproveButton onApprove={handleSendEmail} isSending={isSending} />
            </div>
          </div>
          
          <div className="w-1/3 glass-panel p-6 rounded-xl border border-slate-700 flex flex-col">
            <SourcePanel sources={sources} />
          </div>
        </div>
      )}
    </div>
  );
}
