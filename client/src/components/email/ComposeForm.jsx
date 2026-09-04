import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

export default function ComposeForm({ onGenerate, isLoading }) {
  const [to, setTo] = useState('');
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate({ prompt, to });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-300">Recipient (Optional)</label>
        <input 
          type="email" 
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="colleague@example.com"
          className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-300">What should the email be about?</label>
        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Draft an email to Alice summarizing the key points from the Q3 Roadmap note..."
          rows={4}
          className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
          required
        />
      </div>

      <div className="flex justify-end mt-2">
        <button 
          type="submit" 
          disabled={isLoading || !prompt.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full" />
          ) : (
            <Sparkles size={18} />
          )}
          {isLoading ? 'Generating Draft...' : 'Generate Draft'}
        </button>
      </div>
    </form>
  );
}
