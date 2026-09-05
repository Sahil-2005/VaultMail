import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Login failed');
      login(data.token, data.user);
      toast.success('Welcome back!');
      navigate('/app');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-root)' }}>
      {/* Left pane — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10 relative overflow-hidden"
        style={{ background: 'var(--bg-panel)', borderRight: '1px solid var(--border)' }}>
        {/* Amber glow */}
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        <div>
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 rounded-md flex items-center justify-center"
              style={{ background: 'var(--amber)' }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 14, color: '#0c0a09' }}>V</span>
            </div>
            <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 15, color: 'var(--text-1)' }}>
              Vault<span style={{ color: 'var(--amber)' }}>Mail</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10">
          {/* Mini terminal preview */}
          <div className="panel mb-8" style={{ padding: '20px', fontFamily: 'JetBrains Mono', fontSize: 12, lineHeight: 1.8 }}>
            <div style={{ color: 'var(--text-3)', marginBottom: 4 }}>$ vault query</div>
            <div style={{ color: 'var(--amber)' }}>⚡ Searching knowledge base...</div>
            <div style={{ color: 'var(--teal)' }}>✓ 5 relevant chunks found</div>
            <div style={{ color: 'var(--text-2)' }}>→ Drafting your email...</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span style={{ color: 'var(--text-1)' }}>Ready</span>
              <span style={{ width: 2, height: 14, background: 'var(--amber)', borderRadius: 1, display: 'inline-block', animation: 'pulse-amber 1.2s ease infinite' }} />
            </div>
          </div>

          <blockquote style={{ borderLeft: '2px solid var(--amber-border)', paddingLeft: 16 }}>
            <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 8 }}>
              "VaultMail turns my scattered notes into perfectly crafted emails. It actually knows what I meant to write."
            </p>
            <footer style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'JetBrains Mono' }}>
              — A developer who hates empty inboxes
            </footer>
          </blockquote>
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'JetBrains Mono' }}>
          © 2026 VaultMail
        </div>
      </div>

      {/* Right pane — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md page-enter">
          <div className="mb-8">
            <div className="pill mb-4">auth · login</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-1)', marginBottom: 8 }}>
              Sign in to your vault
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-2)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--amber)', fontWeight: 600 }}>Create one free</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
                Email address
              </label>
              <input
                type="email"
                className="field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
                Password
              </label>
              <input
                type="password"
                className="field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-amber" style={{ width: '100%', marginTop: 8 }}>
              {isLoading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Signing in...</> : <>Sign in</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
