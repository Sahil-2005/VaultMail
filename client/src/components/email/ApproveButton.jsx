import { Send, ShieldCheck } from 'lucide-react';

export default function ApproveButton({ onApprove, isSending }) {
  return (
    <button
      onClick={onApprove}
      disabled={isSending}
      className="group flex items-center gap-2.5 px-7 py-3 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      style={{
        background: isSending
          ? 'linear-gradient(135deg, #065f46, #047857)'
          : 'linear-gradient(135deg, #059669, #10b981)',
        boxShadow: isSending
          ? 'none'
          : '0 4px 16px -2px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255,255,255,0.08) inset',
      }}
      onMouseEnter={(e) => {
        if (!isSending) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(16, 185, 129, 0.5), 0 0 0 1px rgba(255,255,255,0.12) inset';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        if (!isSending) {
          e.currentTarget.style.boxShadow = '0 4px 16px -2px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255,255,255,0.08) inset';
        }
      }}
    >
      {isSending ? (
        <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      ) : (
        <ShieldCheck size={18} className="group-hover:scale-110 transition-transform" />
      )}
      {isSending ? 'Sending...' : 'Approve & Send'}
    </button>
  );
}
