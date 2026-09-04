import { useState, useRef } from 'react';
import { Upload, FileArchive, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function VaultUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
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

  const handleUpload = async () => {
    if (!file) return;
    
    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/vault/upload', {
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-3xl mx-auto w-full">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Upload Vault</h1>
        <p className="text-slate-400">Zip your Obsidian vault and upload it here to build the knowledge base.</p>
      </header>

      <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/5 blur-[100px] pointer-events-none rounded-full"></div>
        
        <div 
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 relative z-10 flex flex-col items-center justify-center min-h-[300px] ${
            file ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-slate-700 hover:border-indigo-500/30 hover:bg-white/5'
          }`}
        >
          {status === 'success' ? (
            <div className="flex flex-col items-center text-emerald-400 animate-in zoom-in duration-500">
              <CheckCircle2 size={64} className="mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">Upload Complete!</h3>
              <p className="text-slate-300 mb-1">Successfully ingested your vault.</p>
              <div className="flex gap-4 mt-4 text-sm text-slate-400 bg-black/20 p-4 rounded-xl">
                <div><span className="text-white font-mono">{result?.num_files}</span> files processed</div>
                <div><span className="text-white font-mono">{result?.num_chunks}</span> knowledge chunks</div>
              </div>
              <button 
                onClick={() => { setFile(null); setStatus('idle'); }}
                className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              >
                Upload Another
              </button>
            </div>
          ) : status === 'uploading' ? (
            <div className="flex flex-col items-center text-indigo-400">
              <Loader2 size={48} className="animate-spin mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Processing Vault...</h3>
              <p className="text-slate-400 text-sm max-w-xs text-center">Extracting markdown, chunking text, and generating embeddings. This may take a minute.</p>
            </div>
          ) : (
            <>
              <div className="bg-slate-800/50 p-4 rounded-full mb-4 ring-1 ring-white/10 shadow-xl">
                {file ? <FileArchive size={32} className="text-indigo-400" /> : <Upload size={32} className="text-slate-400" />}
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">
                {file ? file.name : 'Select a .zip file'}
              </h3>
              
              <p className="text-slate-400 text-sm mb-8">
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Drag and drop or click to browse'}
              </p>

              <input 
                type="file" 
                accept=".zip" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange}
              />

              <div className="flex gap-4">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors border border-white/10 shadow-sm"
                >
                  {file ? 'Change File' : 'Browse Files'}
                </button>
                
                {file && (
                  <button 
                    onClick={handleUpload}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/25 border border-indigo-400/20 flex items-center gap-2 animate-in slide-in-from-right-4"
                  >
                    <Upload size={18} />
                    Start Ingestion
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {status === 'error' && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 animate-in slide-in-from-top-2">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium">Upload Failed</h4>
              <p className="text-sm opacity-80 mt-1">{errorMsg}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
