import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PenLine, FolderOpen, HardDrive, ArrowRight, Sparkles, Shield, Zap, Brain, FileText, Mail } from 'lucide-react';
import { apiFetch } from '../utils/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ notes: 0, emails: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [notesRes, historyRes] = await Promise.all([
          apiFetch('/api/vault/notes'),
          apiFetch('/api/emails/history'),
        ]);
        const notes = await notesRes.json();
        const history = await historyRes.json();
        setStats({ notes: notes.length, emails: history.length });
      } catch { /* ignore */ }
    };
    fetchStats();
  }, []);

  const features = [
    {
      icon: <Brain size={24} />,
      title: "RAG-Powered Drafting",
      desc: "Every email is grounded in your Obsidian vault via semantic search. Zero hallucination.",
      color: "indigo",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: <Shield size={24} />,
      title: "Human-in-the-Loop",
      desc: "Review, edit, and approve every draft before it's sent. You are always in control.",
      color: "emerald",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: <Zap size={24} />,
      title: "Source Citations",
      desc: "See exactly which notes were used. Verify facts at a glance with full transparency.",
      color: "amber",
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  const quickActions = [
    { to: "/compose", icon: <PenLine size={20} />, label: "Compose Email", desc: "Draft an AI-powered email" },
    { to: "/upload", icon: <HardDrive size={20} />, label: "Upload Vault", desc: "Index your Obsidian notes" },
    { to: "/vault", icon: <FolderOpen size={20} />, label: "Browse Vault", desc: "Explore indexed content" },
  ];

  return (
    <div className="page-enter flex flex-col gap-10 pb-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-10 lg:p-14">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12), transparent 70%)' }}
        />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08), transparent 70%)' }}
        />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6">
            <Sparkles size={12} />
            AI-Powered Email Agent
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            Welcome to <span className="text-gradient">VaultMail</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl leading-relaxed mb-8">
            Draft context-aware emails from your Obsidian vault. Your personal AI agent that never hallucinates.
          </p>

          <div className="flex items-center gap-6">
            <Link to="/compose" className="btn-primary flex items-center gap-2 group">
              <PenLine size={18} />
              Start Composing
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }} />
                <FileText size={14} />
                <span className="font-mono text-white">{stats.notes}</span> notes indexed
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail size={14} />
                <span className="font-mono text-white">{stats.emails}</span> emails sent
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <div key={i} className="glass-panel glass-panel-hover rounded-2xl p-7 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ background: `radial-gradient(circle, rgba(129, 140, 248, 0.08), transparent 70%)` }}
            />
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 text-white shadow-lg transition-all duration-500 group-hover:scale-110`}
              style={{ boxShadow: `0 8px 24px -4px rgba(99, 102, 241, 0.3)` }}
            >
              {f.icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((a, i) => (
            <Link
              key={i}
              to={a.to}
              className="glass-panel rounded-2xl p-5 flex items-center gap-4 group transition-all duration-300 hover:border-indigo-500/20 hover:bg-white/[0.04]"
            >
              <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/20 transition-all">
                {a.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">{a.label}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{a.desc}</p>
              </div>
              <ArrowRight size={16} className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
