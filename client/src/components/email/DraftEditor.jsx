export default function DraftEditor({ draft, setDraft }) {
  return (
    <div className="flex flex-col h-full gap-4">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
        Draft Review
      </h2>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-400">To:</label>
        <input 
          type="email" 
          value={draft.to || ''}
          onChange={(e) => setDraft({ ...draft, to: e.target.value })}
          className="bg-slate-800/30 border border-slate-700/50 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-slate-500"
          placeholder="recipient@example.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-400">Subject:</label>
        <input 
          type="text" 
          value={draft.subject || ''}
          onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
          className="bg-slate-800/30 border border-slate-700/50 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-slate-500 font-medium"
        />
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <label className="text-sm font-medium text-slate-400">Message Body:</label>
        <textarea 
          value={draft.body || ''}
          onChange={(e) => setDraft({ ...draft, body: e.target.value })}
          className="bg-slate-800/30 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-slate-500 flex-1 resize-none font-sans"
        />
      </div>
    </div>
  );
}
