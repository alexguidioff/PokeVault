'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { getEngineColor, getFeatureColor } from '@/utils/colors'

const ITEMS_PER_PAGE = 24

export default function RomGrid({ roms }: { roms: any[] }) {
  const [search, setSearch] = useState('')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedBase, setSelectedBase] = useState('')
  const [sortOrder, setSortOrder] = useState('A-Z')
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE)

  // Resetta la paginazione quando cambiano i filtri
  useEffect(() => {
    setVisibleItems(ITEMS_PER_PAGE)
  }, [search, selectedFeatures, selectedBase, sortOrder])

  // Estrazione Feature Uniche
  const features = useMemo(() => {
    const set = new Set<string>()
    roms.forEach(r => {
      if (r['Feature Tags']) {
        r['Feature Tags'].split(',').forEach((t: string) => set.add(t.trim()))
      }
    })
    return Array.from(set).filter(Boolean).sort()
  }, [roms])

  // Estrazione Motori Base Unici
  const bases = useMemo(() => {
    const set = new Set<string>()
    roms.forEach(r => {
      if (r['Hack Of']) {
        r['Hack Of'].split(',').forEach((b: string) => set.add(b.trim()))
      }
    })
    return Array.from(set).filter(Boolean).sort()
  }, [roms])

  // Filtraggio e Ordinamento
  const filteredAndSortedRoms = useMemo(() => {
    let result = roms.filter(r => {
      const matchSearch = r['Hack Name']?.toLowerCase().includes(search.toLowerCase()) || false
      
      const matchFeature = selectedFeatures.length === 0 || selectedFeatures.every(f => {
        const tags = r['Feature Tags']?.split(',').map((s: string) => s.trim()) || []
        return tags.includes(f)
      })

      const matchBase = selectedBase 
        ? r['Hack Of']?.split(',').map((s: string) => s.trim()).includes(selectedBase) 
        : true

      return matchSearch && matchFeature && matchBase
    })

    // Ordinamento
    result.sort((a, b) => {
      const nameA = a['Hack Name']?.toLowerCase() || ''
      const nameB = b['Hack Name']?.toLowerCase() || ''
      if (sortOrder === 'A-Z') return nameA.localeCompare(nameB)
      if (sortOrder === 'Z-A') return nameB.localeCompare(nameA)
      return 0
    })

    return result
  }, [roms, search, selectedFeatures, selectedBase, sortOrder])

  const handleAddFeature = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    if (val && !selectedFeatures.includes(val)) setSelectedFeatures([...selectedFeatures, val])
  }

  const removeFeature = (feat: string) => {
    setSelectedFeatures(selectedFeatures.filter(f => f !== feat))
  }

  // Elementi attualmente visibili in base alla paginazione
  const currentRoms = filteredAndSortedRoms.slice(0, visibleItems)

  return (
    <div className="w-full">
      {/* SEZIONE CONTROLLI E FILTRI */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          
          {/* Ricerca */}
          <div className="relative md:col-span-2 w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"></line>
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search by ROM name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition font-medium"
            />
            {/* Bottone Cancella Ricerca */}
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-red-500 transition"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            )}
          </div>

          {/* Filtro Motore Base */}
          <div className="w-full">
            <select 
              value={selectedBase} 
              onChange={(e) => setSelectedBase(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition font-medium cursor-pointer appearance-none"
            >
              <option value="">All Engines</option>
              {bases.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Filtro Features */}
          <div className="w-full">
            <select 
              value=""
              onChange={handleAddFeature}
              className="w-full p-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition font-medium cursor-pointer appearance-none"
            >
              <option value="" disabled>+ Add Feature</option>
              {features.filter(f => !selectedFeatures.includes(f)).map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {/* CHIPS DELLE FEATURE SELEZIONATE */}
        {selectedFeatures.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
            {selectedFeatures.map(feat => (
              <span key={feat} className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm border ${getFeatureColor(feat)} transition-all cursor-default`}>
                {feat}
                <button 
                  onClick={() => removeFeature(feat)}
                  className="hover:opacity-70 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* HEADER RISULTATI & ORDINAMENTO */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1">
        <div className="flex items-center gap-4">
          <p className="text-slate-500 font-medium">
            Found <strong className="text-slate-900">{filteredAndSortedRoms.length}</strong> {filteredAndSortedRoms.length === 1 ? 'hack' : 'hacks'}
          </p>
          {(search || selectedFeatures.length > 0 || selectedBase) && (
            <button 
              onClick={() => { setSearch(''); setSelectedFeatures([]); setSelectedBase(''); }} 
              className="text-red-600 hover:text-red-700 font-bold text-sm transition flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              Clear All
            </button>
          )}
        </div>

        {/* Menu Ordinamento */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Sort:</span>
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-1.5 bg-transparent border-none text-slate-700 font-bold cursor-pointer outline-none focus:ring-0"
          >
            <option value="A-Z">A - Z</option>
            <option value="Z-A">Z - A</option>
          </select>
        </div>
      </div>

      {/* GRIGLIA GIOCHI */}
      {currentRoms.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentRoms.map((rom) => {
              // Calcolo dinamico variabili interne
              const pokemonId = (Number(rom.id) % 151) + 1;
              const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
              const baseEngine = rom['Hack Of']?.split(',')[0]?.trim() || 'Unknown Base';
              const engineColorClasses = getEngineColor(baseEngine);

              return (
                <Link 
                  href={`/rom/${rom.id}`} 
                  key={rom.id}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 hover:border-red-300 transition-all duration-300 flex flex-col"
                >
                  {/* Container Immagine */}
                  <div className="aspect-video bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden border-b border-slate-100">
                    <img 
                      src={imageUrl} 
                      alt={rom['Hack Name']} 
                      className="w-28 h-28 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500 z-10" 
                    />
                    <div className="absolute top-3 right-3 z-20">
                      <span className="bg-white/80 backdrop-blur-md text-[10px] font-black text-slate-400 px-2 py-1 rounded-md border border-slate-200 shadow-sm">
                        #{rom.id}
                      </span>
                    </div>
                  </div>

                  {/* Dettagli Card */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm ${engineColorClasses}`}>
                        {baseEngine}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-black text-slate-900 group-hover:text-red-600 transition-colors leading-tight mb-2 line-clamp-2">
                      {rom['Hack Name']}
                    </h2>
                    
                    <p className="text-sm text-slate-500 font-medium mb-4 line-clamp-1">
                      <span className="text-slate-400">by</span> {rom['Name of Creator'] || 'Unknown Trainer'}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 uppercase border border-slate-200">
                        {rom['Language (Base)'] || 'EN'}
                      </span>
                      <span className="text-red-600 font-bold text-xs group-hover:translate-x-1 transition-transform uppercase tracking-wider">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* BOTTONE LOAD MORE */}
          {visibleItems < filteredAndSortedRoms.length && (
            <div className="mt-12 flex justify-center">
              <button 
                onClick={() => setVisibleItems(prev => prev + ITEMS_PER_PAGE)}
                className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-black font-bold py-3 px-8 rounded-xl shadow-sm transition-all hover:shadow-md"
              >
                Load More ROMs
              </button>
            </div>
          )}
        </>
      ) : (
        /* STATO VUOTO */
        <div className="bg-white p-12 sm:p-20 rounded-3xl border border-dashed border-slate-300 text-center shadow-sm">
          <div className="text-5xl mb-4 opacity-50">🔍</div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">No ROMs found</h3>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            We couldn't find any hacks matching your criteria. Try adjusting your search or clearing some filters.
          </p>
          <button 
            onClick={() => { setSearch(''); setSelectedFeatures([]); setSelectedBase(''); }}
            className="mt-6 bg-slate-900 hover:bg-black text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )
}