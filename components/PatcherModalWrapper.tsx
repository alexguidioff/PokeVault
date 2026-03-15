'use client'

import { useState } from 'react'
import PatcherModal from './PatcherModal'

export default function PatcherModalWrapper({ romName, baseEngine, patchUrl }: { romName: string, baseEngine: string, patchUrl?: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl shadow-[0_4px_0_0_#991b1b] active:shadow-none active:translate-y-1 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        Patch ROM Online
      </button>

      <PatcherModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        romName={romName} 
        baseEngine={baseEngine}
        patchUrl={patchUrl}
      />
    </>
  )
}