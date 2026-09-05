import { useState, useEffect } from 'react';
import { History, Calendar, User, Mail, Search, Inbox, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/emails/history');
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      const sorted = data.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
      setEmails(sorted);
    } catch (err) {
      toast.error('Failed to load email history');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmails = emails.filter(email =>
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(d);
  };

  const getRelativeTime = (dateString) => {
    const d = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return formatDate(dateString);
  };

  return (
    <div className="page-enter h-full flex flex-col max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <History className="text-indigo-400" size={28} />
          Email History
        </h1>
        <p className="text-slate-400 mt-2 text-sm">Track all emails drafted and sent through VaultMail.</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col">
        {/* Search & count */}
        <div className="mb-5 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              className="input-premium w-full !pl-11 !py-2.5 !text-sm"
              placeholder="Search by recipient or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-xs text-slate-500 font-mono bg-white/[0.03] px-3 py-2 rounded-lg border border-white/[0.06] shrink-0">
            {filteredEmails.length} email{filteredEmails.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-[3px] border-indigo-500/20 border-t-indigo-400 animate-spin" />
          </div>
        ) : filteredEmails.length > 0 ? (
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="space-y-3">
              {filteredEmails.map((email, idx) => (
                <div
                  key={email.message_id}
                  className="rounded-xl p-5 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 group"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-white truncate group-hover:text-indigo-300 transition-colors">
                        {email.subject}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2.5 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <User size={13} />
                          <span className="truncate max-w-[200px] text-slate-400">{email.to}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={13} />
                          <span title={formatDate(email.sent_at)}>{getRelativeTime(email.sent_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-500/8 border border-emerald-500/15 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <Inbox size={28} className="text-slate-600" />
            </div>
            <p className="text-sm">
              {searchTerm ? 'No emails match your search.' : 'No emails have been sent yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
