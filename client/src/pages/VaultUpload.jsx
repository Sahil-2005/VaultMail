import { useState, useRef } from 'react';
import { Upload, FileArchive, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

export default function VaultUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const accept = (selected) => {
    if (!selected?.name.endsWith('.zip')) {
      setStatus('error');
      setErrorMsg('Only .zip files are accepted. Zip your Obsidian vault folder first.');
      return;
    }
    setFile(selected);
    setStatus('idle');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) accept(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await apiFetch('/api/vault/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Upload failed');
      setResult(data);
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="page-enter max-w-2xl mx-auto pb-10">
      {/* Header */}
      <div className="mb-8">
        <div className="pill mb-3">vault · upload</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-1)', marginBottom: 6 }}>
          Upload Obsidian Vault
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-2)' }}>
          Zip your vault folder and drop it below. Every .md file will be parsed, chunked, and embedded into Qdrant.
        </p>
      </div>

      {/* Drop zone */}
      {status !== 'success' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? 'var(--amber)' : file ? 'var(--amber-border)' : 'var(--border)'}`,
            borderRadius: 16,
            padding: '48px 32px',
            textAlign: 'center',
            cursor: file ? 'default' : 'pointer',
            transition: 'all 0.2s',
            background: isDragging ? 'var(--amber-dim)' : file ? 'rgba(245,158,11,0.04)' : 'transparent',
          }}
        >
          <input type="file" accept=".zip" className="hidden" ref={fileInputRef} onChange={(e) => accept(e.target.files[0])} />

          {status === 'uploading' ? (
            <div className="flex flex-col items-center gap-4">
              <div className="spinner spinner-lg" />
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>Processing vault...</p>
                <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Parsing markdown, generating embeddings, indexing into Qdrant</p>
              </div>
              {/* Progress bar */}
              <div style={{ width: 200, height: 3, background: 'var(--bg-hover)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '70%', background: 'var(--amber)', borderRadius: 99, animation: 'none' }} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: file ? 'var(--amber-dim)' : 'var(--bg-hover)',
                border: `1px solid ${file ? 'var(--amber-border)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: file ? 'float 3s ease-in-out infinite' : 'none',
              }}>
                {file
                  ? <FileArchive size={26} style={{ color: 'var(--amber)' }} />
                  : <Upload size={26} style={{ color: 'var(--text-3)' }} />}
              </div>

              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>
                  {file ? file.name : 'Drop your vault zip here'}
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB · ready to upload` : 'or click to browse · .zip files only'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button className="btn btn-outline" style={{ fontSize: 13, padding: '8px 16px' }}
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                  {file ? 'Change file' : 'Browse files'}
                </button>
                {file && status !== 'uploading' && (
                  <button className="btn btn-amber" style={{ fontSize: 13, padding: '8px 16px' }}
                    onClick={(e) => { e.stopPropagation(); handleUpload(); }}>
                    <Upload size={14} /> Upload & Index
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Success state */}
      {status === 'success' && result && (
        <div className="panel-teal p-8 flex flex-col items-center text-center gap-6 page-enter" style={{ borderRadius: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--teal-dim)', border: '1px solid var(--teal-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={28} style={{ color: 'var(--teal)' }} />
          </div>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)', marginBottom: 6 }}>Vault indexed successfully</h3>
            <p style={{ fontSize: 14, color: 'var(--text-2)' }}>Your knowledge base is ready for AI-powered drafting.</p>
          </div>
          <div className="flex items-center gap-8">
            <MetricBlock value={result.num_files} label="Files parsed" />
            <div style={{ width: 1, height: 40, background: 'var(--border)' }} />
            <MetricBlock value={result.num_chunks} label="Chunks indexed" />
          </div>
          <div className="flex items-center gap-3">
            <button className="btn btn-outline" style={{ fontSize: 13 }} onClick={() => { setFile(null); setStatus('idle'); }}>
              Upload another
            </button>
            <Link to="/app/compose" className="btn btn-amber" style={{ fontSize: 13 }}>
              Compose email <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* Error banner */}
      {status === 'error' && (
        <div className="page-enter mt-4 flex items-start gap-3 p-4 rounded-xl"
          style={{ background: 'var(--danger-dim)', border: '1px solid rgba(248,113,113,0.2)' }}>
          <AlertCircle size={16} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--danger)' }}>Upload failed</p>
            <p style={{ fontSize: 12, color: 'rgba(248,113,113,0.8)', marginTop: 2 }}>{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="panel-elevated mt-8 p-6" style={{ borderRadius: 14 }}>
        <p style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
          How to prepare your vault
        </p>
        <div className="space-y-3">
          {[
            'Open your Obsidian vault folder in File Explorer',
            'Select all files → Right click → Send to → Compressed (zipped) folder',
            'Upload the resulting .zip file here',
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--amber)', flexShrink: 0 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <p style={{ fontSize: 13, color: 'var(--text-2)' }}>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricBlock({ value, label }) {
  return (
    <div className="text-center">
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 28, fontWeight: 700, color: 'var(--teal)' }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{label}</div>
    </div>
  );
}
