'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'

export default function FavoriteButton({ romId }: { romId: number }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        // AGGIUNTA: Se non c'è utente, fermati qui e non cercare nulla!
        if (!user) return; 
      
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('rom_id', romId)
          .eq('user_id', user.id)
          .maybeSingle()
      
        if (data) setIsFavorite(true)
      }
    
    fetchFavoriteStatus()
  }, [romId])

  const toggleFavorite = async () => {
    if (!user) return alert("You must be logged in to add favorites!")
    setLoading(true)

    if (isFavorite) {
      await supabase.from('favorites').delete().match({ rom_id: romId, user_id: user.id })
      setIsFavorite(false)
    } else {
      await supabase.from('favorites').insert({ rom_id: romId, user_id: user.id })
      setIsFavorite(true)
    }
    setLoading(false)
  }

  // Skeleton senza "absolute"
  if (loading) return <div className="w-10 h-10 animate-pulse bg-slate-200 rounded-full"></div>

  return (
    <button 
      onClick={toggleFavorite}
      className={`flex items-center justify-center p-2 rounded-full font-bold group transition-all duration-300 ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-400'}`}
      title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 drop-shadow-sm transition-transform ${isFavorite ? 'scale-110' : ''}`} fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  )
}