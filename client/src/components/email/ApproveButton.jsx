import { Send, ShieldCheck } from 'lucide-react';

export default function ApproveButton({ onApprove, isSending }) {
  return (
    <button
      onClick={onApprove}
      disabled={isSending}
      className="btn btn-amber"
      style={{ opacity: isSending ? 0.6 : 1, cursor: isSending ? 'not-allowed' : 'pointer' }}
    >
      {isSending
        ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2, borderTopColor: '#0c0a09', borderColor: 'rgba(12,10,9,0.3)' }} /> Sending...</>
        : <><ShieldCheck size={14} /> Approve & send</>}
    </button>
  );
}
