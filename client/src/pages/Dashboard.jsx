import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PenLine, HardDrive, FolderOpen, ArrowRight, FileText, Send } from 'lucide-react';
import { apiFetch } from '../utils/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ notes: 0, emails: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [nr, hr] = await Promise.all([apiFetch('/api/vault/notes'), apiFetch('/api/emails/history')]);
        const notes = await nr.json();
        const history = await hr.json();
        setStats({ notes: Array.isArray(notes) ? notes.length : 0, emails: Array.isArray(history) ? history.length : 0 });
      } catch { /* ignore */ }
    })();
  }, []);

  return (
    <div className="page-enter space-y-8 pb-10">
      {/* ── HEADER ── */}
      <div>
        <div className="pill mb-3">dashboard · overview</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-1)', marginBottom: 6 }}>
          Your Vault Dashboard
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-2)' }}>
          Monitor your knowledge base and email activity at a glance.
        </p>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          value={stats.notes}
          label="Notes indexed"
          icon={<FileText size={18} style={{ color: 'var(--amber)' }} />}
          accent="amber"
        />
        <StatCard
          value={stats.emails}
          label="Emails sent"
          icon={<Send size={18} style={{ color: 'var(--teal)' }} />}
          accent="teal"
        />
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div>
        <p style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
          Quick actions
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionCard to="/app/compose" icon={<PenLine size={18} />} label="Compose Email"
            desc="Draft an AI-powered email from your vault" accent="amber" />
          <ActionCard to="/app/upload" icon={<HardDrive size={18} />} label="Upload Vault"
            desc="Index a new Obsidian vault or re-index existing" />
          <ActionCard to="/app/vault" icon={<FolderOpen size={18} />} label="Browse Vault"
            desc="Explore the notes currently indexed in Qdrant" />
        </div>
      </div>

      {/* ── HOW TO USE ── */}
      <div className="panel-elevated p-7" style={{ borderRadius: 16 }}>
        <p style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
          Getting started
        </p>
        <div className="space-y-5">
          {[
            { n: '01', title: 'Upload your vault', body: 'Go to Vault Upload and drop a .zip file of your Obsidian notes. VaultMail processes every .md file, generates Gemini embeddings, and stores them in Qdrant.' },
            { n: '02', title: 'Compose an email', body: 'Open Compose, enter a recipient and describe what you want to say. The RAG engine retrieves relevant notes and Gemini drafts a grounded email.' },
            { n: '03', title: 'Review and send', body: 'Edit the draft in the editor, verify the source citations on the right, and click Send Email when satisfied.' },
          ].map(({ n, title, body }) => (
            <div key={n} className="flex items-start gap-5">
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--amber)', flexShrink: 0, marginTop: 3, fontWeight: 600 }}>{n}</span>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, icon, accent }) {
  return (
    <div className={accent === 'amber' ? 'panel-amber' : 'panel-teal'} style={{ padding: '20px 24px', borderRadius: 16 }}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: accent === 'amber' ? 'var(--amber-dim)' : 'var(--teal-dim)', border: `1px solid ${accent === 'amber' ? 'var(--amber-border)' : 'var(--teal-border)'}` }}>
          {icon}
        </div>
      </div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 32, fontWeight: 700, color: accent === 'amber' ? 'var(--amber)' : 'var(--teal)', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 6 }}>{label}</div>
    </div>
  );
}

function ActionCard({ to, icon, label, desc, accent }) {
  return (
    <Link to={to} className="panel-elevated flex flex-col gap-3 p-5 group no-underline" style={{ borderRadius: 14, transition: 'border-color 0.2s', textDecoration: 'none' }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center"
        style={{
          background: accent === 'amber' ? 'var(--amber-dim)' : 'var(--bg-hover)',
          border: `1px solid ${accent === 'amber' ? 'var(--amber-border)' : 'var(--border)'}`,
          color: accent === 'amber' ? 'var(--amber)' : 'var(--text-2)',
          transition: 'all 0.2s',
        }}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>{label}</h3>
        <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{desc}</p>
      </div>
      <ArrowRight size={14} style={{ color: 'var(--text-3)', alignSelf: 'flex-end' }} />
    </Link>
  );
}
