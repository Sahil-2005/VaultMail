import ReactMarkdown from 'react-markdown';
import { BookOpen, FileText } from 'lucide-react';

export default function SourcePanel({ sources }) {
  if (!sources || sources.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <h2 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-4 uppercase tracking-wider">
          <BookOpen size={14} className="text-indigo-400" />
          Sources Used
        </h2>
        <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
          <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
            <FileText size={18} />
          </div>
          <p className="text-xs text-center">No sources cited for this draft.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <h2 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-4 shrink-0 uppercase tracking-wider">
        <BookOpen size={14} className="text-indigo-400" />
        Sources Used
        <span className="ml-auto text-xs font-mono text-slate-600 bg-white/[0.04] px-2 py-0.5 rounded-full">{sources.length}</span>
      </h2>

      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {sources.map((source, index) => (
          <div key={index} className="rounded-xl p-4 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-sm font-medium text-indigo-300 group-hover:text-indigo-200 transition-colors leading-tight">
                {source.title || source.file || 'Unknown Note'}
              </h3>
              <span className="text-[10px] text-slate-600 px-2 py-0.5 bg-white/[0.04] rounded-full shrink-0 font-mono">
                #{index + 1}
              </span>
            </div>
            <div className="text-xs text-slate-400 leading-relaxed prose prose-invert prose-p:my-1 prose-headings:my-2 prose-sm max-w-none">
              <ReactMarkdown>{source.excerpt || source.text || ''}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
