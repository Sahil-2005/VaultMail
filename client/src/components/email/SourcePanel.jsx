import ReactMarkdown from 'react-markdown';
import { BookOpen } from 'lucide-react';

export default function SourcePanel({ sources }) {
  if (!sources || sources.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <BookOpen size={20} className="text-blue-400" />
          Sources Used
        </h2>
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm italic">
          No sources were cited for this draft.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4 shrink-0">
        <BookOpen size={20} className="text-blue-400" />
        Sources Used
      </h2>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {sources.map((source, index) => (
          <div key={index} className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/50">
            <h3 className="text-sm font-medium text-blue-300 mb-1 flex items-center justify-between">
              {source.title || source.file || 'Unknown Note'}
              <span className="text-xs text-slate-500 px-2 py-0.5 bg-slate-900/50 rounded-full">
                Excerpt
              </span>
            </h3>
            <div className="text-xs text-slate-300 prose prose-invert prose-p:my-1 prose-headings:my-2 prose-sm max-w-none">
              <ReactMarkdown>{source.excerpt || source.text || ''}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
