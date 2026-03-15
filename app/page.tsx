import { supabase } from '@/utils/supabase'
import RomGrid from '@/components/RomGrid'

export const revalidate = 0

export default async function Home() {
  // Scarichiamo tutte le roms dal server
  const { data: roms } = await supabase
    .from('ROMS')
    .select('*')
    .order('Hack Name', { ascending: true })

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        
        {/* Titolo Principale */}
        <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Explore the Vault
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Discover, filter, and track the best Pokémon ROM Hacks from the community.
          </p>
        </div>

        {/* Inseriamo il Client Component passandogli i dati */}
        <RomGrid roms={roms || []} />

      </main>
    </div>
  )
}

