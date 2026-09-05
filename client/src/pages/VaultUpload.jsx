import { useState, useRef } from 'react';
import { Upload, FileArchive, CheckCircle2, AlertCircle, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

export default function VaultUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.name.endsWith('.zip')) {
        setStatus('error');
        setErrorMsg('Please upload a .zip file containing your Obsidian vault.');
        return;
      }
      setFile(selected);
      setStatus('idle');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (!selected.name.endsWith('.zip')) {
        setStatus('error');
        setErrorMsg('Please upload a .zip file containing your Obsidian vault.');
        return;
      }
      setFile(selected);
      setStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiFetch('/api/vault/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
        setStatus('success');
      } else {
        throw new Error(data.detail || 'Upload failed');
      }
    } catch (error) {
      setErrorMsg(error.message);
      setStatus('error');
    }
  };

  return (
    <div className="page-enter flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto w-full">
      <div className="w-full mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-3">Upload Your Vault</h1>
        <p className="text-slate-400 text-base">Zip your Obsidian vault and upload it to build your AI knowledge base.</p>
      </div>

      <div className="w-full glass-panel rounded-3xl p-10 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.06), transparent 60%)' }}
        />

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative z-10 border-2 border-dashed rounded-2xl p-14 text-center transition-all duration-500 flex flex-col items-center justify-center min-h-[320px] ${
            isDragging
              ? 'border-indigo-400/60 bg-indigo-500/[0.06] scale-[1.01]'
              : file
                ? 'border-indigo-500/40 bg-indigo-500/[0.03]'
                : 'border-white/[0.08] hover:border-indigo-400/20 hover:bg-white/[0.02]'
          }`}
        >
          {status === 'success' ? (
            <div className="flex flex-col items-center page-enter">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 glow-success">
                <CheckCircle2 size={40} className="text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Vault Indexed Successfully</h3>
              <p className="text-slate-400 mb-6">Your knowledge base is ready for AI-powered drafting.</p>
              
              <div className="flex gap-6 mb-8">
                <div className="text-center px-6 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-2xl font-bold font-mono text-white">{result?.num_files}</div>
                  <div className="text-xs text-slate-500 mt-1">Files Processed</div>
                </div>
                <div className="text-center px-6 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-2xl font-bold font-mono text-white">{result?.num_chunks}</div>
                  <div className="text-xs text-slate-500 mt-1">Knowledge Chunks</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setFile(null); setStatus('idle'); }} className="btn-ghost text-sm">
                  Upload Another
                </button>
                <Link to="/compose" className="btn-primary flex items-center gap-2 text-sm !py-2.5">
                  Start Composing <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ) : status === 'uploading' ? (
            <div className="flex flex-col items-center page-enter">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full border-[3px] border-indigo-500/20 border-t-indigo-400 animate-spin" />
                <Sparkles size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Processing Your Vault</h3>
              <p className="text-slate-400 text-sm max-w-xs text-center leading-relaxed">
                Extracting markdown, generating embeddings, and indexing into the vector database...
              </p>
              <div className="w-48 h-1.5 bg-white/[0.04] rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shimmer" style={{ width: '60%' }} />
              </div>
            </div>
          ) : (
            <>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 ${
                file
                  ? 'bg-indigo-500/10 border border-indigo-500/20'
                  : 'bg-white/[0.04] border border-white/[0.06]'
              }`} style={file ? { animation: 'float 3s ease-in-out infinite' } : {}}>
                {file ? <FileArchive size={28} className="text-indigo-400" /> : <Upload size={28} className="text-slate-500" />}
              </div>

              <h3 className="text-lg font-semibold text-white mb-1">
                {file ? file.name : 'Drop your vault here'}
              </h3>
              <p className="text-slate-500 text-sm mb-8">
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'or click to browse for a .zip file'}
              </p>

              <input type="file" accept=".zip" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

              <div className="flex gap-3">
                <button onClick={() => fileInputRef.current?.click()} className="btn-ghost border border-white/[0.06] text-sm">
                  {file ? 'Change File' : 'Browse Files'}
                </button>
                {file && (
                  <button onClick={handleUpload} className="btn-primary flex items-center gap-2 text-sm !py-2.5 page-enter">
                    <Upload size={16} />
                    Start Ingestion
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {status === 'error' && (
          <div className="mt-6 p-4 bg-red-500/[0.06] border border-red-500/15 rounded-xl flex items-start gap-3 text-red-400 page-enter">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Upload Failed</h4>
              <p className="text-xs opacity-80 mt-1">{errorMsg}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
