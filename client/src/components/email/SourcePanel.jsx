import ReactMarkdown from 'react-markdown';
import { BookOpen, FileText } from 'lucide-react';

export default function SourcePanel({ sources }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, flexShrink: 0 }}>
        <BookOpen size={13} style={{ color: 'var(--amber)' }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', fontFamily: 'JetBrains Mono', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Sources
        </span>
        {sources?.length > 0 && (
          <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--amber)', background: 'var(--amber-dim)', border: '1px solid var(--amber-border)', padding: '1px 8px', borderRadius: 99 }}>
            {sources.length}
          </span>
        )}
      </div>

      {/* Content */}
      {!sources || sources.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', textAlign: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-hover)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={16} />
          </div>
          <p style={{ fontSize: 12 }}>No sources cited</p>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 2 }}>
          {sources.map((s, i) => (
            <div key={i} style={{ borderRadius: 10, border: '1px solid var(--border)', padding: '12px 14px', background: 'rgba(0,0,0,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--amber)' }}>#{i + 1}</span>
                <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.title || s.file || 'Unknown note'}
                </h3>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.6 }}>
                <ReactMarkdown>{s.excerpt || s.text || ''}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
