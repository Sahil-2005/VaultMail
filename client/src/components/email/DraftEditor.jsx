import { Mail, Type, AlignLeft } from 'lucide-react';

export default function DraftEditor({ draft, setDraft }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', animation: 'pulse-amber 2s ease infinite', flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>Draft Review</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)', background: 'var(--bg-hover)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 4 }}>
          editable
        </span>
      </div>

      <FieldRow icon={<Mail size={12} />} label="To">
        <input
          type="email"
          className="field"
          value={draft.to || ''}
          onChange={(e) => setDraft({ ...draft, to: e.target.value })}
          placeholder="recipient@example.com"
          style={{ fontSize: 13, padding: '8px 12px' }}
        />
      </FieldRow>

      <FieldRow icon={<Type size={12} />} label="Subject">
        <input
          type="text"
          className="field"
          value={draft.subject || ''}
          onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
          style={{ fontSize: 13, fontWeight: 600, padding: '8px 12px' }}
        />
      </FieldRow>

      <FieldRow icon={<AlignLeft size={12} />} label="Body" grow>
        <textarea
          className="field"
          value={draft.body || ''}
          onChange={(e) => setDraft({ ...draft, body: e.target.value })}
          style={{ flex: 1, resize: 'none', fontSize: 13, lineHeight: 1.65, padding: '10px 12px', fontFamily: 'JetBrains Mono' }}
        />
      </FieldRow>
    </div>
  );
}

function FieldRow({ icon, label, children, grow }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: grow ? 1 : 'none', minHeight: grow ? 0 : 'auto' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: 'var(--text-3)', fontFamily: 'JetBrains Mono', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {icon} {label}
      </label>
      {children}
    </div>
  );
}
