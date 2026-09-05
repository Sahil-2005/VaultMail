import { useState, useEffect } from 'react';
import { FileText, Search, FolderOpen, Hash, ChevronRight } from 'lucide-react';
import { apiFetch } from '../utils/api';

export default function VaultBrowser() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [content, setContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [q, setQ] = useState('');

  useEffect(() => {
    apiFetch('/api/vault/notes')
      .then(r => r.json())
      .then(setNotes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openNote = async (filename) => {
    setLoadingContent(true);
    setSelected(filename);
    setContent(null);
    try {
      const r = await apiFetch(`/api/vault/notes/${encodeURIComponent(filename)}`);
      setContent(await r.json());
    } catch (e) { console.error(e); }
    finally { setLoadingContent(false); }
  };

  const filtered = notes.filter(n => n.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="page-enter h-full flex flex-col">
      <div className="mb-6">
        <div className="pill mb-3">vault · browser</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-1)' }}>
          Vault Browser
        </h1>
      </div>

      <div className="flex-1 flex gap-5 min-h-0">
        {/* ── NOTES LIST ── */}
        <div className="w-72 flex flex-col panel shrink-0" style={{ overflow: 'hidden' }}>
          {/* Search */}
          <div style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}>
            <div className="relative">
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
              <input
                type="text"
                className="field"
                placeholder="Search notes..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                style={{ paddingLeft: 30, padding: '8px 10px 8px 30px', fontSize: 13 }}
              />
            </div>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FolderOpen size={11} style={{ color: 'var(--text-3)' }} />
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-3)' }}>
                {filtered.length} notes
              </span>
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
            {loading ? (
              <div className="flex justify-center p-8"><div className="spinner" /></div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center p-10 text-center">
                <FileText size={28} style={{ color: 'var(--text-3)', marginBottom: 8 }} />
                <p style={{ fontSize: 13, color: 'var(--text-3)' }}>No notes found</p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {filtered.map((note) => (
                  <button
                    key={note.filename}
                    onClick={() => openNote(note.filename)}
                    style={{
                      width: '100%', textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                      transition: 'all 0.15s',
                      background: selected === note.filename ? 'var(--amber-dim)' : 'transparent',
                      border: `1px solid ${selected === note.filename ? 'var(--amber-border)' : 'transparent'}`,
                      color: selected === note.filename ? 'var(--amber)' : 'var(--text-2)',
                    }}
                  >
                    <FileText size={13} style={{ flexShrink: 0, opacity: 0.7 }} />
                    <span style={{ fontSize: 13, fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {note.title}
                    </span>
                    <ChevronRight size={12} style={{ flexShrink: 0, opacity: 0.4 }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── PREVIEW ── */}
        <div className="flex-1 panel flex flex-col" style={{ overflow: 'hidden' }}>
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center" style={{ color: 'var(--text-3)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg-hover)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <FileText size={22} />
              </div>
              <p style={{ fontSize: 13 }}>Select a note to preview</p>
            </div>
          ) : loadingContent ? (
            <div className="flex-1 flex items-center justify-center"><div className="spinner spinner-lg" /></div>
          ) : content ? (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Note header */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'rgba(245,158,11,0.03)' }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>{content.title}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Hash size={11} style={{ color: 'var(--text-3)' }} />
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-3)' }}>{selected}</span>
                </div>
              </div>

              {/* Content with line numbers */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex' }}>
                {/* Line numbers */}
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRight: '1px solid var(--border)', padding: '16px 12px', flexShrink: 0, userSelect: 'none' }}>
                  {content.content.split('\n').map((_, i) => (
                    <div key={i} style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-3)', lineHeight: 1.7, textAlign: 'right' }}>
                      {i + 1}
                    </div>
                  ))}
                </div>
                {/* Code content */}
                <pre style={{
                  flex: 1, padding: '16px 20px', margin: 0,
                  fontFamily: 'JetBrains Mono', fontSize: 13, lineHeight: 1.7,
                  color: 'var(--text-2)', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  overflowY: 'visible',
                }}>
                  {content.content}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Failed to load note content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
