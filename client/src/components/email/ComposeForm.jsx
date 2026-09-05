import { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';

export default function ComposeForm({ onGenerate, isLoading }) {
  const [to, setTo] = useState('');
  const [prompt, setPrompt] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (prompt.trim()) onGenerate({ prompt, to });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
          <Send size={11} /> Recipient
          <span style={{ color: 'var(--text-3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>optional</span>
        </label>
        <input
          type="email"
          className="field"
          placeholder="colleague@example.com"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>

      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
          <Sparkles size={11} style={{ color: 'var(--amber)' }} /> What should the email be about?
        </label>
        <textarea
          className="field"
          style={{ resize: 'none', lineHeight: 1.6, height: 140 }}
          placeholder="Draft an email summarizing the Q3 product roadmap milestones to Alice, referencing who owns each initiative..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />
        <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6, fontFamily: 'JetBrains Mono' }}>
          // AI will search your vault before drafting
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="btn btn-amber"
        >
          {isLoading
            ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Generating...</>
            : <><Sparkles size={14} /> Generate draft</>}
        </button>
      </div>
    </form>
  );
}
