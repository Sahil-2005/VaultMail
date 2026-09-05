import { useState } from 'react';
import ComposeForm from '../components/email/ComposeForm';
import DraftEditor from '../components/email/DraftEditor';
import SourcePanel from '../components/email/SourcePanel';
import ApproveButton from '../components/email/ApproveButton';
import toast from 'react-hot-toast';
import { PenLine, ArrowLeft } from 'lucide-react';
import { apiFetch } from '../utils/api';

export default function ComposePage() {
  const [draft, setDraft] = useState(null);
  const [sources, setSources] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleGenerateDraft = async ({ prompt, to }) => {
    setIsGenerating(true);
    try {
      const res = await apiFetch('/api/draft-email', {
        method: 'POST',
        body: JSON.stringify({ prompt, to_email: to })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to generate draft');
      }
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
      const res = await apiFetch('/api/emails/send', {
        method: 'POST',
        body: JSON.stringify({
          to: draft.to,
          subject: draft.subject,
          body_html: draft.body
        })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to send email');
      }
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
    <div className="page-enter h-full flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
          <PenLine className="text-indigo-400" size={28} />
          Compose Email
        </h1>
        <p className="text-slate-400 text-sm">Ask the AI agent to draft an email grounded in your vault contents.</p>
      </div>

      {!draft && (
        <div className="glass-panel p-8 rounded-2xl max-w-2xl">
          <ComposeForm onGenerate={handleGenerateDraft} isLoading={isGenerating} />
        </div>
      )}

      {draft && (
        <div className="flex gap-5 flex-1 min-h-[500px]">
          <div className="flex-1 flex flex-col gap-4">
            <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col">
              <DraftEditor draft={draft} setDraft={setDraft} />
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => { setDraft(null); setSources([]); }}
                className="btn-ghost flex items-center gap-2 text-sm"
                disabled={isSending}
              >
                <ArrowLeft size={16} />
                Discard & Start Over
              </button>
              <ApproveButton onApprove={handleSendEmail} isSending={isSending} />
            </div>
          </div>

          <div className="w-[340px] glass-panel p-6 rounded-2xl flex flex-col">
            <SourcePanel sources={sources} />
          </div>
        </div>
      )}
    </div>
  );
}
