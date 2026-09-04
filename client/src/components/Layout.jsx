import { Outlet, NavLink } from 'react-router-dom';
import { Mail, HardDrive, FolderOpen, LayoutDashboard, PenLine, History } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  const navItems = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/upload", icon: <HardDrive size={20} />, label: "Vault Upload" },
    { to: "/vault", icon: <FolderOpen size={20} />, label: "Vault Browser" },
    { to: "/compose", icon: <PenLine size={20} />, label: "Compose Email" },
    { to: "/history", icon: <History size={20} />, label: "Email History" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-y-0 border-l-0 flex flex-col z-10 relative">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/30">
            <Mail className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold text-gradient tracking-tight">VaultMail</h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[var(--bg-main)]">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="p-8 max-w-6xl mx-auto h-full flex flex-col relative z-0">
          <Outlet />
        </div>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}
