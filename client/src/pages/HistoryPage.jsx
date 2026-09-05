import { useState, useEffect } from 'react';
import { Search, Send, ArrowUpRight, Inbox, Calendar, User } from 'lucide-react';
import { apiFetch } from '../utils/api';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    apiFetch('/api/emails/history')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => setEmails(d.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at))))
      .catch(() => toast.error('Failed to load history'))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (ds) => {
    const utc = ds.endsWith('Z') ? ds : `${ds}Z`;
    const d = new Date(utc);
    const diff = Math.floor((Date.now() - d) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
  };

  const filtered = emails.filter(e =>
    e.subject?.toLowerCase().includes(q.toLowerCase()) ||
    e.to?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="page-enter flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="pill mb-3">emails · sent history</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-1)' }}>Email History</h1>
        <p style={{ fontSize: 14, color: 'var(--text-2)', marginTop: 4 }}>All emails drafted and sent through VaultMail.</p>
      </div>

      {/* Search bar + count */}
      <div className="flex items-center gap-4 mb-5">
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input
            type="text"
            className="field"
            placeholder="Search by recipient or subject..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-3)', padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-panel)', whiteSpace: 'nowrap' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="spinner spinner-lg" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--bg-panel)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Inbox size={24} style={{ color: 'var(--text-3)' }} />
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-3)' }}>
              {q ? 'No emails match your search.' : 'No emails sent yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((email, idx) => (
              <div
                key={email.message_id ?? idx}
                className="panel-elevated group"
                style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, transition: 'border-color 0.2s', cursor: 'default', borderRadius: 12 }}
              >
                {/* Left icon */}
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--teal-dim)', border: '1px solid var(--teal-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Send size={16} style={{ color: 'var(--teal)' }} />
                </div>

                {/* Middle content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {email.subject}
                  </p>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-3)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <User size={11} /> {email.to}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Calendar size={11} /> {fmt(email.sent_at)}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <ArrowUpRight size={14} style={{ color: 'var(--text-3)', flexShrink: 0, opacity: 0.5 }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
