import { Send } from 'lucide-react';

export default function ApproveButton({ onApprove, isSending }) {
  return (
    <button 
      onClick={onApprove}
      disabled={isSending}
      className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSending ? (
        <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full" />
      ) : (
        <Send size={18} />
      )}
      {isSending ? 'Sending...' : 'Approve & Send'}
    </button>
  );
}
