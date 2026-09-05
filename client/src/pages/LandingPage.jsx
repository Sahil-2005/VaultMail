import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Database, Cpu, Send, ExternalLink } from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-root)' }}>
      {/* ── NOISE TEXTURE OVERLAY ── */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
      />

      {/* ── AMBER HALO ── */}
      <div className="fixed top-[-20%] left-[10%] w-[700px] h-[700px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 65%)' }} />

      {/* ── TEAL HALO ── */}
      <div className="fixed bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.04) 0%, transparent 65%)' }} />

      {/* ── NAV ── */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          {/* Logo mark — stylized V with circuit line */}
          <div className="relative w-9 h-9 flex items-center justify-center rounded-lg"
            style={{ background: 'var(--amber)', boxShadow: '0 0 20px rgba(245,158,11,0.4)' }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 16, color: '#0c0a09' }}>V</span>
          </div>
          <div>
            <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 16, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
              Vault<span style={{ color: 'var(--amber)' }}>Mail</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a href="https://github.com/Sahil-2005/VaultMail" target="_blank" rel="noreferrer"
            className="btn btn-ghost" style={{ padding: '8px', borderRadius: '8px' }}>
            <ExternalLink size={18} style={{ color: 'var(--text-3)' }} />
          </a>
          {isAuthenticated ? (
            <Link to="/app" className="btn btn-amber" style={{ gap: 6 }}>
              Open Dashboard <ArrowRight size={15} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" style={{ fontSize: 14 }}>Sign In</Link>
              <Link to="/register" className="btn btn-amber">Get started free</Link>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-16 pb-24">
        {/* Inline terminal tag */}
        <div className="pill mb-8" style={{ animation: 'page-in 0.5s ease forwards' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', display: 'inline-block', animation: 'pulse-amber 2s ease infinite' }} />
          Gemini RAG · Qdrant · Obsidian
        </div>

        <h1 className="page-enter" style={{
          fontFamily: 'Inter', fontWeight: 900,
          fontSize: 'clamp(40px, 7vw, 88px)',
          lineHeight: 1.04, letterSpacing: '-0.04em',
          color: 'var(--text-1)', maxWidth: 900,
          marginBottom: 24,
        }}>
          Your Vault.<br />
          <span className="text-amber-gradient">Your Emails. </span>
          Your AI.
        </h1>

        <p className="page-enter" style={{
          fontSize: 18, color: 'var(--text-2)', maxWidth: 560,
          lineHeight: 1.6, marginBottom: 40,
          animationDelay: '0.1s',
        }}>
          Upload your Obsidian knowledge base. VaultMail uses advanced RAG to search your notes and drafts precision emails grounded in your own words.
        </p>

        <div className="flex items-center gap-4 page-enter" style={{ animationDelay: '0.2s' }}>
          <Link to={isAuthenticated ? '/app' : '/register'}
            className="btn btn-amber" style={{ fontSize: 16, padding: '13px 28px' }}>
            {isAuthenticated ? 'Dashboard' : 'Start for free'} <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ fontSize: 16, padding: '13px 28px' }}>
            Sign in
          </Link>
        </div>

        {/* ── TERMINAL MOCKUP ── */}
        <div className="page-enter mt-20 w-full max-w-3xl text-left" style={{ animationDelay: '0.3s' }}>
          <div className="panel" style={{ overflow: 'hidden', border: '1px solid rgba(245,158,11,0.15)', boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,158,11,0.08) inset' }}>
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)' }}>
              <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
              <span className="ml-4" style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-3)' }}>vaultmail ~ agent.log</span>
            </div>
            {/* Terminal content */}
            <div className="p-6 space-y-3" style={{ fontFamily: 'JetBrains Mono', fontSize: 13, lineHeight: 1.8 }}>
              <TerminalLine ln="01" color="var(--text-3)" text="$ vaultmail upload --path ./obsidian-vault.zip" />
              <TerminalLine ln="02" color="var(--teal)" text="✓  Parsed 47 Markdown files" />
              <TerminalLine ln="03" color="var(--teal)" text="✓  Generated 312 Gemini embeddings" />
              <TerminalLine ln="04" color="var(--teal)" text="✓  Indexed into Qdrant collection [vault_notes]" />
              <TerminalLine ln="05" color="var(--text-3)" text="" />
              <TerminalLine ln="06" color="var(--text-3)" text='$ vaultmail draft --to "alice@acme.com" --about "Q3 roadmap update"' />
              <TerminalLine ln="07" color="var(--amber)" text='⚡ Searching vault for: "Q3 roadmap update"' />
              <TerminalLine ln="08" color="var(--amber)" text='   Retrieved 5 relevant chunks (score ≥ 0.82)' />
              <TerminalLine ln="09" color="var(--teal)" text="✓  Draft ready — 3 notes cited" />
              <div className="flex items-center gap-2 mt-1">
                <span className="ln">10</span>
                <span style={{ color: 'var(--text-1)' }}>Subject: Q3 Roadmap — Key Milestones & Owners</span>
                <span style={{
                  display: 'inline-block', width: 2, height: 16, marginLeft: 2,
                  background: 'var(--amber)', animation: 'pulse-amber 1.2s ease infinite',
                  borderRadius: 1,
                }} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 border-t py-24 px-6" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="pill pill-teal mx-auto mb-4">How it works</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-1)' }}>
              Three steps from notes to inbox.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard
              n="01"
              icon={<Database size={22} style={{ color: 'var(--amber)' }} />}
              title="Upload your Vault"
              desc="Zip your entire Obsidian vault. VaultMail parses every .md file, strips frontmatter, and chunks your knowledge automatically."
            />
            <StepCard
              n="02"
              icon={<Cpu size={22} style={{ color: 'var(--teal)' }} />}
              title="Semantic Indexing"
              desc="Every chunk is embedded via Gemini's text-embedding-001 and stored in Qdrant. Retrieval happens at millisecond speed."
            />
            <StepCard
              n="03"
              icon={<Send size={22} style={{ color: 'var(--amber)' }} />}
              title="AI-drafted Emails"
              desc="Describe what you want. The RAG pipeline fetches the exact notes, Gemini Flash drafts the email. Review, edit, send."
            />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t px-8 py-6 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-3)' }}>
          VaultMail © 2026
        </span>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-3)' }}>
          Obsidian × Gemini × Qdrant
        </span>
      </footer>
    </div>
  );
}

function TerminalLine({ ln, color, text }) {
  return (
    <div className="flex items-start gap-4">
      <span className="ln" style={{ paddingTop: 1 }}>{ln}</span>
      <span style={{ color, flex: 1 }}>{text}</span>
    </div>
  );
}

function StepCard({ n, icon, title, desc }) {
  return (
    <div className="panel-elevated p-7 flex flex-col gap-4 group hover:border-amber-500/20 transition-all duration-300"
      style={{ borderRadius: 16 }}>
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
          {icon}
        </div>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-3)', letterSpacing: '0.08em' }}>{n}</span>
      </div>
      <div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-1)', marginBottom: 8, letterSpacing: '-0.02em' }}>{title}</h3>
        <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{desc}</p>
      </div>
    </div>
  );
}
