import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, HardDrive, FolderOpen, PenLine, History, LogOut } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/app', icon: <LayoutDashboard size={16} />, label: 'Dashboard', end: true },
  { to: '/app/upload', icon: <HardDrive size={16} />, label: 'Vault Upload' },
  { to: '/app/vault', icon: <FolderOpen size={16} />, label: 'Vault Browser' },
  { to: '/app/compose', icon: <PenLine size={16} />, label: 'Compose' },
  { to: '/app/history', icon: <History size={16} />, label: 'History' },
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-root)' }}>

      {/* ── SIDEBAR ── */}
      <aside className="w-60 flex flex-col shrink-0" style={{
        background: 'var(--bg-panel)',
        borderRight: '1px solid var(--border)',
      }}>
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 px-5 py-5 no-underline" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ background: 'var(--amber)', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 13, color: '#0c0a09' }}>V</span>
          </div>
          <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 14, color: 'var(--text-1)' }}>
            Vault<span style={{ color: 'var(--amber)' }}>Mail</span>
          </span>
        </Link>

        {/* Nav section label */}
        <div className="px-5 pt-5 pb-2">
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Navigation
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User strip */}
        <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--bg-hover)' }}>
            {/* Avatar */}
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'var(--amber-dim)', border: '1px solid var(--amber-border)' }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 12, color: 'var(--amber)' }}>
                {user?.name?.[0]?.toUpperCase() ?? 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name}
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email}
              </p>
            </div>
            <button onClick={logout} title="Sign out"
              className="btn btn-ghost" style={{ padding: '6px', borderRadius: '6px', flexShrink: 0 }}>
              <LogOut size={14} style={{ color: 'var(--text-3)' }} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 overflow-y-auto flex flex-col" style={{ background: 'var(--bg-root)' }}>
        {/* Top line decoration */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, var(--amber) 0%, var(--teal) 60%, transparent 100%)', flexShrink: 0 }} />

        <div className="flex-1 p-8 max-w-5xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-1)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            fontSize: 14,
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          },
          success: { iconTheme: { primary: 'var(--teal)', secondary: 'var(--bg-root)' } },
          error: { iconTheme: { primary: 'var(--danger)', secondary: 'var(--bg-root)' } },
        }}
      />
    </div>
  );
}
