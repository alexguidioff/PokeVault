'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'

export default function ProgressTracker({ romId }: { romId: number }) {
  const [status, setStatus] = useState('')
  const [gyms, setGyms] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        // AGGIUNTA: Esci subito se l'utente non è loggato
        if (!user) return;
      
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('rom_id', romId)
          .eq('user_id', user.id)
          .maybeSingle()
      
        if (data) setStatus(data.status)
      }

    fetchProgress()
  }, [romId])

  const saveProgress = async (newStatus: string, newGyms: number) => {
    if (!user) return
    setStatus(newStatus)
    setGyms(newGyms)

    // Upsert: Inserisce o Aggiorna in automatico grazie al vincolo UNIQUE(user_id, rom_id)
    await supabase.from('user_progress').upsert({
      rom_id: romId,
      user_id: user.id,
      status: newStatus || null,
      gyms_completed: newGyms
    }, { onConflict: 'user_id, rom_id' })
  }

  if (loading) return <div className="p-6 bg-slate-50 animate-pulse rounded-3xl h-48"></div>

  if (!user) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 text-center">
        <h3 className="text-xl font-bold mb-2 text-slate-800">📊 My Progress</h3>
        <p className="text-slate-500 text-sm mb-4">Devi essere connesso per tracciare i progressi.</p>
        <a href="/login" className="block w-full bg-slate-800 text-white font-bold py-2 rounded-lg hover:bg-slate-700 transition text-sm">
          Login
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold mb-4 text-slate-800 border-b pb-2">📊 My Progress</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Status</label>
          <select 
            value={status}
            onChange={(e) => saveProgress(e.target.value, gyms)}
            className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          >
            <option value="">Not Started</option>
            <option value="Started">Started</option>
            <option value="League Completed">League Completed</option>
            <option value="Post-Game Completed">Post-Game Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Gyms Completed</label>
          <select 
            value={gyms}
            onChange={(e) => saveProgress(status, Number(e.target.value))}
            className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          >
            <option value="0">0 Gyms</option>
            {[1,2,3,4,5,6,7,8,16].map(num => (
              <option key={num} value={num}>{num} Gyms</option>
            ))}
          </select>
        </div>
        
        <p className="text-xs text-emerald-600 font-medium text-center mt-2">
          ✓ Salvataggio automatico
        </p>
      </div>
    </div>
  )
}