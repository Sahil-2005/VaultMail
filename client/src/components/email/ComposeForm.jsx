import { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';

export default function ComposeForm({ onGenerate, isLoading }) {
  const [to, setTo] = useState('');
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate({ prompt, to });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Send size={14} className="text-slate-500" />
          Recipient
          <span className="text-slate-600 text-xs font-normal">(optional)</span>
        </label>
        <input
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="colleague@example.com"
          className="input-premium"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Sparkles size={14} className="text-indigo-400" />
          What should the email be about?
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Draft an email to Alice summarizing the key milestones from the Q3 Roadmap, and mention who is leading each initiative..."
          rows={5}
          className="input-premium resize-none leading-relaxed"
          required
        />
        <p className="text-xs text-slate-600 mt-1">
          The AI will search your vault for relevant context before drafting.
        </p>
      </div>

      <div className="flex justify-end mt-1">
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="btn-primary flex items-center gap-2.5 group"
        >
          {isLoading ? (
            <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          ) : (
            <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
          )}
          {isLoading ? 'Generating Draft...' : 'Generate Draft'}
        </button>
      </div>
    </form>
  );
}
