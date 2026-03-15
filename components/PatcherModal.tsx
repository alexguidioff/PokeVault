'use client'

import { useState } from 'react'

interface PatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  romName: string;
  baseEngine: string;
  patchUrl?: string; // Il link al file .bps su Supabase Storage
}

export default function PatcherModal({ isOpen, onClose, romName, baseEngine, patchUrl }: PatcherModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'patching' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  if (!isOpen) return null;

  // Funzione che simula il patching (la vera logica la inseriremo nel prossimo step)
  const handlePatch = async () => {
    if (!file) return;
    
    if (!patchUrl) {
      setStatus('error');
      setErrorMessage('Patch file is missing from our servers. Please contact the admin.');
      return;
    }

    setStatus('patching');

    try {
      // 1. CARICAMENTO DAL TUO STESSO SERVER (Zero blocchi)
      const loadScript = (src: string) => {
        return new Promise((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          // Mostriamo un errore più chiaro in console se fallisce
          script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
          document.head.appendChild(script);
        });
      };

      // Carichiamo i file dalla tua cartella public/patcher
      await loadScript("/patcher/MarcFile.js");
      await loadScript("/patcher/crc.js");
      await loadScript("/patcher/ips.js");
      await loadScript("/patcher/ups.js");
      await loadScript("/patcher/bps.js");

      const win = window as any;
      if (!win.MarcFile) throw new Error('Failed to load patcher engine from CDN. Check your connection.');

      // 2. Preparazione dei File Binari
      const romBuffer = await file.arrayBuffer();
      const patchResponse = await fetch(patchUrl);
      
      if (!patchResponse.ok) throw new Error('Could not download the patch file from Supabase.');
      const patchBuffer = await patchResponse.arrayBuffer();

      // 3. Inizializzazione del Motore
      const romFile = new win.MarcFile(romBuffer);
      const patchFile = new win.MarcFile(patchBuffer);

      // 4. Identificazione del Formato (BPS, UPS, IPS)
      let patcher;
      const urlLower = patchUrl.toLowerCase();
      
      if (urlLower.includes('.bps')) {
        patcher = win.parseBPSFile(patchFile);
      } else if (urlLower.includes('.ups')) {
        patcher = win.parseUPSFile(patchFile);
      } else if (urlLower.includes('.ips')) {
        patcher = win.parseIPSFile(patchFile);
      } else {
        throw new Error('Unsupported patch format. Must be a .bps, .ups, or .ips file.');
      }

      // 5. LA FUSIONE
      const patchedRom = patcher.apply(romFile);

      // 6. Download Automatico del gioco fuso
      const blob = new Blob([patchedRom._u8array], { type: 'application/octet-stream' });
      const downloadUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${romName} (Patched).gba`; 
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      setStatus('success');

    } catch (error: any) {
      console.error("Patching error:", error);
      setStatus('error');
      setErrorMessage(error.message || 'Failed to apply patch. Make sure you selected the exact clean base ROM required.');
    }
  }
  

  const handleReset = () => {
    setFile(null);
    setStatus('idle');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Pulsante Chiudi */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900 leading-tight">Patch <span className="text-red-600">{romName}</span></h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Please provide a clean <strong className="text-slate-700">{baseEngine}</strong> ROM.</p>
          </div>

          {/* STATO: IDLE (Selezione File) */}
          {status === 'idle' && (
            <div className="space-y-6">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 hover:border-red-500 hover:bg-red-50 rounded-2xl cursor-pointer transition-colors group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-10 h-10 text-slate-400 group-hover:text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  <p className="text-sm text-slate-600 font-bold mb-1">
                    {file ? file.name : "Click to select base ROM"}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">.gba or .nds files only</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".gba,.nds,.gbc,.gb"
                  onChange={(e) => setFile(e.target.files?.[0] || null)} 
                />
              </label>

              <button 
                onClick={handlePatch}
                disabled={!file}
                className={`w-full font-black py-4 rounded-xl uppercase tracking-widest text-sm transition-all shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none ${file ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_4px_0_0_#991b1b]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                Apply Patch
              </button>
            </div>
          )}

          {/* STATO: PATCHING (Caricamento) */}
          {status === 'patching' && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-900 font-bold">Applying patch...</p>
              <p className="text-xs text-slate-500 mt-1">Fusing files entirely in your browser.</p>
            </div>
          )}

          {/* STATO: SUCCESS (Completato) */}
          {status === 'success' && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Success!</h3>
              <p className="text-sm text-slate-500 font-medium mb-6">Your patched ROM is downloading automatically.</p>
              <button onClick={onClose} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-colors">
                Close
              </button>
            </div>
          )}

          {/* STATO: ERROR (Errore) */}
          {status === 'error' && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Patch Failed</h3>
              <p className="text-sm text-red-500 font-bold mb-6">{errorMessage}</p>
              <button onClick={handleReset} className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold py-3 rounded-xl transition-colors">
                Try Again
              </button>
            </div>
          )}

        </div>
        
        {/* Footer Disclaimer */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            All patching is done locally. Your ROM never leaves your device.
          </p>
        </div>
      </div>
    </div>
  )
}