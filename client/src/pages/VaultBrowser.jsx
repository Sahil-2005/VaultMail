import { useState, useEffect } from 'react';
import { FileText, Loader2, ChevronRight, Search, FolderOpen, Hash } from 'lucide-react';
import { apiFetch } from '../utils/api';

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
      const res = await apiFetch('/api/vault/notes');
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
      const res = await apiFetch(`/api/vault/notes/${encodeURIComponent(filename)}`);
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
    <div className="page-enter h-full flex flex-col">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Vault Browser</h1>
        <p className="text-slate-400 text-sm">Explore the files currently indexed in your knowledge base.</p>
      </header>

      <div className="flex-1 flex gap-5 min-h-0">
        {/* Notes List */}
        <div className="w-80 flex flex-col glass-panel rounded-2xl overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-white/[0.04]">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-premium w-full !py-2.5 !pl-10 !text-sm !rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
              <FolderOpen size={12} />
              <span className="font-mono">{filteredNotes.length}</span> notes
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-2">
            {loading ? (
              <div className="flex justify-center p-10">
                <div className="w-8 h-8 rounded-full border-[3px] border-indigo-500/20 border-t-indigo-400 animate-spin" />
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 text-slate-500">
                <FileText size={32} className="opacity-20 mb-3" />
                <p className="text-sm">No notes found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredNotes.map((note) => (
                  <button
                    key={note.filename}
                    onClick={() => fetchNoteContent(note.filename)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-300 group ${
                      selectedNote === note.filename
                        ? 'bg-indigo-500/10 text-white'
                        : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
                    }`}
                    style={selectedNote === note.filename ? { border: '1px solid rgba(129, 140, 248, 0.12)' } : { border: '1px solid transparent' }}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText size={15} className={selectedNote === note.filename ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'} />
                      <span className="truncate text-sm font-medium">{note.title}</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-600 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Note Preview */}
        <div className="flex-1 glass-panel rounded-2xl overflow-hidden flex flex-col">
          {selectedNote ? (
            loadingContent ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-[3px] border-indigo-500/20 border-t-indigo-400 animate-spin" />
              </div>
            ) : noteContent ? (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Header */}
                <div className="p-6 border-b border-white/[0.04]" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.04), transparent)' }}>
                  <h2 className="text-xl font-semibold text-white mb-1">{noteContent.title}</h2>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Hash size={11} />
                    <span className="font-mono">{selectedNote}</span>
                  </div>
                </div>
                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    {noteContent.content}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                Failed to load content.
              </div>
            )
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
                <FileText size={24} className="text-slate-600" />
              </div>
              <p className="text-sm">Select a note to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
