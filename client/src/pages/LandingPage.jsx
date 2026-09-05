import { Link } from 'react-router-dom';
import { Mail, Brain, Zap, ArrowRight, Shield, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'var(--bg-main)' }}>
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"
        style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08), transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3"
        style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08), transparent 70%)' }} />

      {/* Navigation Bar */}
      <nav className="relative z-10 p-6 flex justify-between items-center max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 p-2.5 rounded-2xl shadow-lg glow-accent">
            <Mail className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient tracking-tight">VaultMail</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">AI Email Agent</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link to="/app" className="btn-primary py-2 px-5 text-sm flex items-center gap-2">
              Go to Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Sign In</Link>
              <Link to="/register" className="btn-primary py-2 px-5 text-sm flex items-center gap-2">
                Get Started <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 relative z-10 mt-16 lg:mt-0">
        <div className="page-enter max-w-4xl mx-auto flex flex-col items-center">
          <div className="badge mb-8 glow-accent border-indigo-500/30 text-indigo-300">
            <SparkleIcon />
            <span>Powered by Gemini AI + Qdrant</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
            Draft Emails perfectly from your <span className="text-gradient">Obsidian Vault</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-400 mb-10 max-w-2xl font-light">
            Upload your Obsidian Knowledge Base. VaultMail uses Advanced RAG to understand your notes and drafts hyper-personalized emails mimicking your exact tone and context.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link to={isAuthenticated ? "/app" : "/register"} className="btn-primary text-lg px-8 py-4 w-full sm:w-auto flex justify-center items-center gap-3 group">
              {isAuthenticated ? "Go to Dashboard" : "Start Drafting for Free"}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4 mt-12 bg-white/[0.01] border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How it works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Upload, Index, and Draft. VaultMail handles the heavy lifting of context retrieval and email generation.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Database size={24} className="text-emerald-400" />}
              title="Upload your Vault"
              desc="Just zip your Obsidian vault and upload. We automatically parse markdown, extract metadata, and chunk your knowledge."
            />
            <FeatureCard 
              icon={<Brain size={24} className="text-purple-400" />}
              title="Semantic Search (RAG)"
              desc="Every note is embedded into a high-dimensional Qdrant Vector database using Gemini embeddings for lightning-fast retrieval."
            />
            <FeatureCard 
              icon={<Zap size={24} className="text-amber-400" />}
              title="AI Email Generation"
              desc="Tell the AI who you are emailing and why. It searches your vault and writes the perfect response via Gemini 1.5 Flash."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.04] py-8 text-center text-slate-500 text-sm">
        <p>© 2026 VaultMail. Built for productivity.</p>
      </footer>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-8 flex flex-col gap-4">
      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
