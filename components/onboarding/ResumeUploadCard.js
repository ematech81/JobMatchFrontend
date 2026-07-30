'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export default function ResumeUploadCard() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | ready | uploading | error
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or DOCX file.');
      setStatus('error');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB.');
      setStatus('error');
      return;
    }
    setFile(selectedFile);
    setError(null);
    setStatus('ready');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFileSelect(e.dataTransfer.files?.[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setStatus('uploading');
    setError(null);

    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch(`${API_URL}/resume/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to analyze resume');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="group relative bg-white border border-border-subtle rounded-xl p-stack-lg transition-all duration-300 hover:shadow-xl flex flex-col">
      <div className="mb-6">
        <div className="w-12 h-12 rounded-lg bg-electric-blue/10 flex items-center justify-center text-electric-blue mb-4">
          <span className="material-symbols-outlined text-3xl">upload_file</span>
        </div>
        <h2 className="font-headline-md text-headline-md text-primary mb-2">Upload Resume</h2>
        <p className="text-slate-gray font-body-md">
          Fast and easy. We&apos;ll parse your existing document and extract your core skills and history.
        </p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          upload-dashed flex-grow rounded-xl bg-surface-container-low/50 border-2 border-transparent
          transition-all flex flex-col items-center justify-center py-10 px-6 cursor-pointer
          ${dragging ? 'bg-electric-blue/5 scale-[0.98]' : 'hover:bg-surface-container-low'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files?.[0])}
        />

        {status === 'idle' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-electric-blue text-4xl group-hover:scale-110 transition-transform">
                cloud_upload
              </span>
            </div>
            <div>
              <p className="font-button text-primary">
                Drag and drop or <span className="text-electric-blue underline">browse</span>
              </p>
              <p className="text-body-sm text-slate-gray mt-1">Supports PDF, DOCX (Max 10MB)</p>
            </div>
          </div>
        )}

        {(status === 'ready' || status === 'uploading') && file && (
          <div className="flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <span className="material-symbols-outlined text-match-success text-5xl">check_circle</span>
            <div className="text-center">
              <p className="font-button text-primary">{file.name}</p>
              <p className="text-body-sm text-match-success mt-1">
                {status === 'uploading' ? 'Analyzing...' : 'Ready for analysis'}
              </p>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={status === 'uploading'}
              className="px-6 py-2 bg-electric-blue text-white rounded-lg font-button disabled:opacity-60"
            >
              {status === 'uploading' ? 'Analyzing...' : 'Analyze Now'}
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <span className="material-symbols-outlined text-error text-5xl">error</span>
            <p className="text-body-sm text-error text-center">{error}</p>
            <button
              onClick={() => { setStatus('idle'); setFile(null); }}
              className="px-6 py-2 border border-border-subtle rounded-lg font-button text-primary"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-3">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-match-success mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <p className="text-body-sm text-slate-gray">Instant extraction of work history and skills.</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-match-success mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <p className="text-body-sm text-slate-gray">Auto-formatting for recruiter-ready views.</p>
        </div>
      </div>
    </div>
  );
}