'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [favorites, setFavorites] = useState<any[]>([])
  const [progress, setProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProfileData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      // Se non c'è sessione, rimanda al login
      if (!session) {
        router.push('/login')
        return
      }
      
      setUser(session.user)

      // Fetch Favorites
      const { data: favs } = await supabase
        .from('favorites')
        .select('*, rom:ROMS(*)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
      if (favs) setFavorites(favs)

      // Fetch Progress
      const { data: prog } = await supabase
        .from('user_progress')
        .select('*, rom:ROMS(*)')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false })
      if (prog) setProgress(prog)

      setLoading(false)
    }

    fetchProfileData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const userName = user?.email?.split('@')[0] || 'Trainer'

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <header className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl font-bold uppercase">
            {userName.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 capitalize">{userName}'s Profile</h1>
            <p className="text-slate-500 mt-1">Manage your favorite hacks and track your journey.</p>
          </div>
        </header>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            📊 Tracked Games
          </h2>
          {progress && progress.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {progress.map((item: any) => (
                <Link key={item.id} href={`/rom/${item.rom.id}`} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-red-500 transition group">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-600 transition">{item.rom['Hack Name']}</h3>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status</span>
                      <span className="font-semibold text-slate-800">{item.status || 'Started'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Badges</span>
                      <span className="font-semibold text-slate-800">{item.gyms_completed} / 16</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
              You haven't tracked any game progress yet.
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            ❤️ Favorite ROMs
          </h2>
          {favorites && favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {favorites.map((item: any) => (
                <Link key={item.id} href={`/rom/${item.rom.id}`} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-red-500 transition group">
                  <span className="text-xs font-bold uppercase tracking-widest bg-red-50 text-red-600 px-2 py-1 rounded mb-3 inline-block">
                    {item.rom['Language (Base)'] || 'Multi'}
                  </span>
                  <h3 className="text-md font-bold text-slate-900 group-hover:text-red-600 transition line-clamp-1">
                    {item.rom['Hack Name']}
                  </h3>
                  <p className="text-slate-400 text-xs mt-2 line-clamp-1">By {item.rom['Name of Creator'] || 'Unknown'}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
              Your favorites list is empty. Explore the Codex and add some!
            </div>
          )}
        </section>

      </div>
    </div>
  )
}