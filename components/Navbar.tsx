'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const userName = user?.email?.split('@')[0] || 'Trainer'

  return (
    <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
      <Link href="/" className="text-2xl font-extrabold tracking-tight hover:opacity-80 transition">
        Poké<span className="text-primary-600">Vault</span>
        </Link>
        
        <div>
          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-sm text-slate-300 hidden md:block">
                Welcome, <strong className="text-white capitalize">{userName}</strong>
              </span>
              
              {/* Nuovo pulsante My Profile */}
              <Link 
                href="/profile"
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded-lg transition"
              >
                My Profile
              </Link>

              <button 
                onClick={handleLogout}
                className="bg-slate-700 hover:bg-red-500 text-white text-sm font-bold py-2 px-4 rounded-lg transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link 
              href="/login"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 px-6 rounded-lg transition shadow-lg shadow-blue-600/30"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}