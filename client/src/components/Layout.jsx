import { Outlet, NavLink } from 'react-router-dom';
import { Mail, HardDrive, FolderOpen, LayoutDashboard, PenLine, History, Sparkles } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  const navItems = [
    { to: "/", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { to: "/upload", icon: <HardDrive size={18} />, label: "Vault Upload" },
    { to: "/vault", icon: <FolderOpen size={18} />, label: "Vault Browser" },
    { to: "/compose", icon: <PenLine size={18} />, label: "Compose Email" },
    { to: "/history", icon: <History size={18} />, label: "Email History" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 flex flex-col z-20 relative border-r border-white/[0.04]" style={{
        background: 'linear-gradient(180deg, rgba(10, 15, 30, 0.95), rgba(3, 7, 18, 0.98))',
        backdropFilter: 'blur(40px)',
      }}>
        {/* Logo */}
        <div className="p-6 pb-8 flex items-center gap-3.5">
          <div className="relative">
            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 p-2.5 rounded-2xl shadow-lg glow-accent">
              <Mail className="text-white" size={22} />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0a0f1e]" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gradient tracking-tight">VaultMail</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">AI Email Agent</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl" style={{
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.08))',
                      border: '1px solid rgba(129, 140, 248, 0.15)',
                      boxShadow: '0 0 20px -8px rgba(129, 140, 248, 0.2) inset',
                    }} />
                  )}
                  <span className={`relative z-10 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                    {item.icon}
                  </span>
                  <span className="relative z-10 font-medium text-sm">{item.label}</span>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-400 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 mx-4 mb-4 rounded-xl border border-white/[0.04] bg-white/[0.02]">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles size={12} className="text-indigo-400/60" />
            <span>Powered by Gemini AI</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative" style={{ background: 'var(--bg-main)' }}>
        {/* Ambient glow orbs */}
        <div className="fixed top-0 right-0 w-[900px] h-[900px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"
          style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.06), transparent 70%)' }}
        />
        <div className="fixed bottom-0 left-64 w-[700px] h-[700px] rounded-full pointer-events-none translate-y-1/3"
          style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.04), transparent 70%)' }}
        />

        <div className="p-8 lg:p-10 max-w-6xl mx-auto min-h-full flex flex-col relative z-0">
          <Outlet />
        </div>
      </main>

      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px',
            padding: '14px 20px',
            boxShadow: '0 8px 32px -4px rgba(0,0,0,0.5)',
            fontFamily: 'Outfit, system-ui, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#030712' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#030712' } },
        }}
      />
    </div>
  );
}
