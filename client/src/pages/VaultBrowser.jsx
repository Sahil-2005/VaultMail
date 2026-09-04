import { useState, useEffect } from 'react';
import { FileText, Loader2, ChevronRight, Search } from 'lucide-react';

export default function VaultBrowser() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteContent, setNoteContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/vault/notes');
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNoteContent = async (filename) => {
    setLoadingContent(true);
    setSelectedNote(filename);
    try {
      const res = await fetch(`/api/vault/notes/${encodeURIComponent(filename)}`);
      const data = await res.json();
      setNoteContent(data);
    } catch (error) {
      console.error("Failed to fetch note content:", error);
    } finally {
      setLoadingContent(false);
    }
  };

  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Vault Browser</h1>
        <p className="text-slate-400">Explore the files currently indexed in your knowledge base.</p>
      </header>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Notes List */}
        <div className="w-1/3 flex flex-col glass-panel rounded-2xl overflow-hidden border-white/5">
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search notes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="animate-spin text-indigo-400" />
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="text-center p-8 text-slate-500 text-sm">
                No notes found.
              </div>
            ) : (
              <div className="space-y-1">
                {filteredNotes.map((note) => (
                  <button
                    key={note.filename}
                    onClick={() => fetchNoteContent(note.filename)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${
                      selectedNote === note.filename 
                        ? 'bg-indigo-500/20 text-indigo-100 border border-indigo-500/20' 
                        : 'text-slate-300 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText size={16} className={selectedNote === note.filename ? 'text-indigo-400' : 'text-slate-500'} />
                      <span className="truncate text-sm font-medium">{note.title}</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-600 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Note Preview */}
        <div className="flex-1 glass-panel rounded-2xl border-white/5 overflow-hidden flex flex-col bg-slate-950/50">
          {selectedNote ? (
            loadingContent ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-indigo-400" />
              </div>
            ) : noteContent ? (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="p-6 border-b border-white/5 bg-white/5">
                  <h2 className="text-xl font-semibold text-white">{noteContent.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">{selectedNote}</p>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 bg-transparent">
                    {noteContent.content}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500">
                Failed to load content.
              </div>
            )
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <FileText size={48} className="mb-4 opacity-20" />
              <p>Select a note to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
