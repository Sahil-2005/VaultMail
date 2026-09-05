import { useState } from 'react';
import { apiFetch } from '../utils/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Sparkles } from 'lucide-react';
import ComposeForm from '../components/email/ComposeForm';
import DraftEditor from '../components/email/DraftEditor';
import SourcePanel from '../components/email/SourcePanel';
import ApproveButton from '../components/email/ApproveButton';

export default function ComposePage() {
  const [draft, setDraft] = useState(null);
  const [sources, setSources] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const generate = async ({ prompt, to }) => {
    setIsGenerating(true);
    try {
      const res = await apiFetch('/api/draft-email', {
        method: 'POST',
        body: JSON.stringify({ prompt, to_email: to })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to generate draft');
      }
      const data = await res.json();
      setDraft(data.draft);
      setSources(data.sources);
      toast.success('Draft ready');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const send = async () => {
    if (!draft) return;
    setIsSending(true);
    try {
      const res = await apiFetch('/api/emails/send', {
        method: 'POST',
        body: JSON.stringify({ to: draft.to, subject: draft.subject, body_html: draft.body })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to send email');
      }
      toast.success('Email sent!');
      setDraft(null);
      setSources([]);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="page-enter flex flex-col gap-6 pb-10 h-full">
      {/* Header */}
      <div>
        <div className="pill mb-3">compose · ai draft</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-1)', marginBottom: 4 }}>
          Compose Email
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-2)' }}>
          Describe what you want to send. The RAG engine searches your vault and Gemini writes the draft.
        </p>
      </div>

      {/* Stage 1 — prompt form */}
      {!draft && (
        <div className="panel max-w-xl" style={{ padding: '28px 32px' }}>
          <ComposeForm onGenerate={generate} isLoading={isGenerating} />
        </div>
      )}

      {/* Stage 2 — draft review */}
      {draft && (
        <div className="flex gap-5 flex-1 min-h-[500px]">
          {/* Draft editor */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="panel flex-1 flex flex-col" style={{ padding: 24 }}>
              <DraftEditor draft={draft} setDraft={setDraft} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => { setDraft(null); setSources([]); }}
                disabled={isSending}
                className="btn btn-ghost"
                style={{ gap: 6, fontSize: 13 }}
              >
                <ArrowLeft size={14} /> Discard & start over
              </button>
              <ApproveButton onApprove={send} isSending={isSending} />
            </div>
          </div>

          {/* Sources */}
          <div className="w-80 panel flex flex-col shrink-0" style={{ padding: 20 }}>
            <SourcePanel sources={sources} />
          </div>
        </div>
      )}
    </div>
  );
}
