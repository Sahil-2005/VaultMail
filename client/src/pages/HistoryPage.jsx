import { useState, useEffect } from 'react';
import { History, Calendar, User, Mail, Search, Inbox } from 'lucide-react';
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
      
      // Sort by sent_at descending (newest first)
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

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <History className="text-indigo-400" size={32} />
          Email History
        </h1>
        <p className="text-slate-400 mt-2">View all emails drafted and sent through VaultMail.</p>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-slate-700/50 flex-1 flex flex-col">
        {/* Search bar */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            placeholder="Search by recipient or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full" />
          </div>
        ) : filteredEmails.length > 0 ? (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-4">
              {filteredEmails.map((email) => (
                <div 
                  key={email.message_id} 
                  className="bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 rounded-xl p-5 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-white truncate group-hover:text-indigo-300 transition-colors">
                        {email.subject}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-slate-500" />
                          <span className="truncate max-w-[200px]">{email.to}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-500" />
                          <span>{formatDate(email.sent_at)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 flex items-center justify-center bg-indigo-500/10 text-indigo-400 p-3 rounded-lg">
                      <Mail size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
            <div className="bg-slate-800/50 p-6 rounded-full border border-slate-700/50">
              <Inbox size={48} className="text-slate-500" />
            </div>
            <p className="text-lg">
              {searchTerm ? 'No emails match your search.' : 'No emails have been sent yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
