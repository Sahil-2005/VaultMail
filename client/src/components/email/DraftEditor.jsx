import { Mail, Type, AlignLeft } from 'lucide-react';

export default function DraftEditor({ draft, setDraft }) {
  return (
    <div className="flex flex-col h-full gap-5">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
        <div className="w-2 h-2 bg-indigo-400 rounded-full" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }} />
        Draft Review
      </h2>

      {/* To field */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Mail size={12} />
          To
        </label>
        <input
          type="email"
          value={draft.to || ''}
          onChange={(e) => setDraft({ ...draft, to: e.target.value })}
          className="input-premium !py-2.5 !text-sm"
          placeholder="recipient@example.com"
        />
      </div>

      {/* Subject field */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Type size={12} />
          Subject
        </label>
        <input
          type="text"
          value={draft.subject || ''}
          onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
          className="input-premium !py-2.5 !text-sm font-medium"
        />
      </div>

      {/* Body field */}
      <div className="flex flex-col gap-1.5 flex-1">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <AlignLeft size={12} />
          Message Body
        </label>
        <textarea
          value={draft.body || ''}
          onChange={(e) => setDraft({ ...draft, body: e.target.value })}
          className="input-premium flex-1 resize-none !text-sm leading-relaxed"
        />
      </div>
    </div>
  );
}
