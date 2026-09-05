import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Registration failed');
      login(data.token, data.user);
      toast.success('Vault initialized!');
      navigate('/app');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-root)' }}>
      {/* Left pane */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10 relative overflow-hidden"
        style={{ background: 'var(--bg-panel)', borderRight: '1px solid var(--border)' }}>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

        <div>
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: 'var(--amber)' }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 14, color: '#0c0a09' }}>V</span>
            </div>
            <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 15, color: 'var(--text-1)' }}>
              Vault<span style={{ color: 'var(--amber)' }}>Mail</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-4">
          {[
            { n: '01', t: 'Upload your Obsidian vault as a .zip file' },
            { n: '02', t: 'Gemini embeds every note into Qdrant vectors' },
            { n: '03', t: 'Describe the email — AI retrieves, drafts, sends' },
          ].map(({ n, t }) => (
            <div key={n} className="flex items-start gap-4">
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--amber)', marginTop: 2, flexShrink: 0 }}>{n}</span>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.5 }}>{t}</p>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'JetBrains Mono' }}>© 2026 VaultMail</div>
      </div>

      {/* Right pane */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md page-enter">
          <div className="mb-8">
            <div className="pill mb-4">auth · register</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-1)', marginBottom: 8 }}>
              Initialize your vault
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-2)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--amber)', fontWeight: 600 }}>Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full name', type: 'text', val: name, set: setName, ph: 'Sahil Gawade', ac: 'name' },
              { label: 'Email address', type: 'email', val: email, set: setEmail, ph: 'you@example.com', ac: 'email' },
              { label: 'Password', type: 'password', val: password, set: setPassword, ph: '••••••••', ac: 'new-password', min: 6 },
            ].map(({ label, type, val, set, ph, ac, min }) => (
              <div key={label}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
                  {label}
                </label>
                <input
                  type={type}
                  className="field"
                  placeholder={ph}
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  autoComplete={ac}
                  minLength={min}
                  required
                />
              </div>
            ))}

            <button type="submit" disabled={isLoading} className="btn btn-amber" style={{ width: '100%', marginTop: 8 }}>
              {isLoading
                ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Creating vault...</>
                : 'Create account'}
            </button>
          </form>

          <p style={{ marginTop: 20, fontSize: 12, color: 'var(--text-3)', textAlign: 'center' }}>
            By continuing, you agree to our terms of service.
          </p>
        </div>
      </div>
    </div>
  );
}
