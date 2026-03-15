'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ReviewForm({ romId }: { romId: number }) {
  const [user, setUser] = useState<any>(null)
  const [loadingSession, setLoadingSession] = useState(true)
  
  const [nome, setNome] = useState('')
  const [voto, setVoto] = useState(5)
  const [hoverVoto, setHoverVoto] = useState(0) // Effetto visivo al passaggio del mouse
  const [commento, setCommento] = useState('')
  const [caricamento, setCaricamento] = useState(false)
  const [messaggioErrore, setMessaggioErrore] = useState<string | null>(null)
  const [messaggioSuccesso, setMessaggioSuccesso] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      setLoadingSession(false)
      if (session?.user?.email) {
        setNome(session.user.email.split('@')[0])
      }
    })
  }, [])

  const inviaRecensione = async (e: React.FormEvent) => {
    e.preventDefault()
    setCaricamento(true)
    setMessaggioErrore(null)
    setMessaggioSuccesso(false)

    const { error } = await supabase.from('reviews').insert([
      { rom_id: romId, nome_utente: nome, voto: voto, commento: commento }
    ])

    if (error) {
      console.error("ERRORE:", error)
      setMessaggioErrore(error.message)
    } else {
      setCommento('') 
      setMessaggioSuccesso(true) // Mostra l'avviso di successo bello!
      router.refresh()
    }
    setCaricamento(false)
  }

  // Skeleton loader durante il controllo sessione
  if (loadingSession) return <div className="mt-10 h-64 animate-pulse bg-slate-200 rounded-3xl"></div>

  if (!user) {
    return (
      <div className="mt-10 bg-white border border-slate-200 p-8 rounded-3xl text-center shadow-sm">
        <h3 className="text-2xl font-extrabold text-slate-800 mb-2">Want to leave a review?</h3>
        <p className="text-slate-500 mb-6 font-medium">You need to be logged in to share your thoughts and rate this ROM.</p>
        <Link href="/login" className="bg-primary-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-600/30 inline-block">
          Sign In / Register
        </Link>
      </div>
    )
  }
  

  return (
    <form onSubmit={inviaRecensione} className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-100 mt-10">
      <h3 className="text-2xl font-extrabold mb-6 text-slate-900">Leave a Review</h3>
      
      {messaggioErrore && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl font-medium">
          Error: {messaggioErrore}
        </div>
      )}

      {messaggioSuccesso && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold flex items-center gap-2 shadow-sm">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          Review submitted successfully!
        </div>
      )}

      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-700 mb-2">Trainer Name</label>
            <input 
              type="text" required
              className="w-full p-4 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition font-medium"
              value={nome} onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Rating</label>
            {/* STELLE INTERATTIVE */}
            <div className="flex items-center gap-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setVoto(star)}
                  onMouseEnter={() => setHoverVoto(star)}
                  onMouseLeave={() => setHoverVoto(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <svg 
                    className={`w-9 h-9 transition-colors ${star <= (hoverVoto || voto) ? 'text-yellow-400 drop-shadow-sm' : 'text-slate-300'}`} 
                    fill="currentColor" viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Your Thoughts</label>
          <textarea 
            placeholder="What makes this hack special? Did you catch any bugs?" required rows={4}
            className="w-full p-4 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition resize-y font-medium leading-relaxed"
            value={commento} onChange={(e) => setCommento(e.target.value)}
          />
        </div>
        
        <button 
          disabled={caricamento}
          className="w-full bg-primary-600 text-white font-extrabold py-4 rounded-xl hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition shadow-lg shadow-primary-600/30 text-lg uppercase tracking-wide"
        >
          {caricamento ? 'Submitting...' : 'Post Review'}
        </button>
      </div>
    </form>
  )
}