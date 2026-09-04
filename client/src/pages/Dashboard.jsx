export default function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-3">Welcome to VaultMail</h1>
        <p className="text-slate-400 text-lg max-w-2xl">Your AI-powered email assistant grounded in your personal knowledge base.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl glass-panel-hover group cursor-default relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <span className="text-6xl">🤖</span>
          </div>
          <div className="h-14 w-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform border border-indigo-500/30">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">AI Drafting</h3>
          <p className="text-slate-400 text-sm leading-relaxed">Generate context-aware emails automatically using the Gemini 2.0 Flash model.</p>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl glass-panel-hover group cursor-default relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <span className="text-6xl">📚</span>
          </div>
          <div className="h-14 w-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform border border-purple-500/30">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">RAG Architecture</h3>
          <p className="text-slate-400 text-sm leading-relaxed">Strictly sources facts from your Obsidian markdown files via Qdrant semantic search.</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl glass-panel-hover group cursor-default relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <span className="text-6xl">✉️</span>
          </div>
          <div className="h-14 w-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform border border-blue-500/30">
            <span className="text-2xl">✉️</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Direct Sending</h3>
          <p className="text-slate-400 text-sm leading-relaxed">Review drafts, edit them, and send directly through your connected Gmail account.</p>
        </div>
      </div>
    </div>
  );
}
