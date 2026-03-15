import { supabase } from '@/utils/supabase'
import Link from 'next/link'
import ReviewForm from '@/components/ReviewForm'
import FavoriteButton from '@/components/FavoriteButton'
import ProgressTracker from '@/components/ProgressTracker'
import { notFound } from 'next/navigation'
import { getEngineColor, getFeatureColor } from '@/utils/colors'
import PatcherModalWrapper from '@/components/PatcherModalWrapper'

export const revalidate = 0

const BadgeList = ({ text }: { text: string }) => {
  if (!text) return <span className="text-slate-400 text-sm italic">No features listed</span>
  return (
    <div className="flex flex-wrap gap-2">
      {String(text).split(',').map((tag, index) => {
        const cleanTag = tag.trim();
        if (!cleanTag) return null;
        return (
          <span key={index} className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${getFeatureColor(cleanTag)} bg-opacity-30`}>
            {cleanTag}
          </span>
        )
      })}
    </div>
  )
}

const extractUrl = (text: any) => {
  if (!text) return null;
  const str = String(text);
  return str.match(/\((.*?)\)/)?.[1] || str;
}

export default async function RomDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Eseguiamo 3 query in parallelo per la massima velocità!
  const [romResponse, reviewsResponse] = await Promise.all([
    supabase.from('ROMS').select('*').eq('id', id).single(),
    supabase.from('reviews').select('*').eq('rom_id', id).order('data_creazione', { ascending: false })
  ])

  const rom = romResponse.data
  const reviews = reviewsResponse.data || []

  if (!rom) return notFound()

  // Terza Query: Cerchiamo altre Hack dello stesso creatore (escludendo quella attuale)
  const { data: creatorRoms } = await supabase
    .from('ROMS')
    .select('id, "Hack Name", "Hack Of", "Latest Version"')
    .eq('Name of Creator', rom['Name of Creator'])
    .neq('id', id)
    .limit(3)

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.voto, 0) / reviews.length).toFixed(1)
    : null


    // Calcoliamo l'immagine di fallback (quella ufficiale che stiamo usando ora)
  const pokemonId = (Number(id) % 151) + 1
  const fallbackImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`
  
  // 1. Usa la cover di Supabase, se vuota usa il fallback
  const coverImageUrl = rom['cover_url'] || fallbackImageUrl;
  
  // 2. Usa gli screenshot di Supabase, se vuoto metti un array vuoto
  const screenshots = rom['screenshots'] || [];

  const mainLink = extractUrl(rom['Link to Hack']);
  const discordLink = extractUrl(rom['Link to Discord']);
  const baseEngine = rom['Hack Of']?.split(',')[0]?.trim() || 'Custom';

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-24">
      
      {/* HEADER NAVBAR INTERNA */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-slate-500 hover:text-black font-bold flex items-center gap-2 text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Grid
          </Link>
          <div className="flex items-center gap-4">
            {/* Popolarità: Views/Downloads */}
            <div className="flex items-center gap-1.5 text-slate-500 font-bold text-sm bg-slate-100 px-3 py-1.5 rounded-lg">
              <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>
              {rom['downloads'] || '1.2K'}
            </div>
            {averageRating && (
              <span className="bg-amber-100 text-amber-900 text-sm font-black px-3 py-1.5 rounded-lg flex items-center gap-1">
                ⭐ {averageRating}
              </span>
            )}
            <FavoriteButton romId={Number(id)} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row gap-10">
        
        {/* COLONNA SINISTRA: Artwork, Galleria, Azioni (Sticky) */}
        <aside className="lg:w-[360px] shrink-0 space-y-6">
          <div className="sticky top-24 space-y-6">
            
            {/* GALLERIA IMMAGINI (Cover + Carosello) */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="aspect-square bg-slate-50 flex items-center justify-center p-8 relative border-b border-slate-100">
                <span className={`absolute top-4 left-4 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${getEngineColor(baseEngine)}`}>
                  {baseEngine}
                </span>
                <img src={coverImageUrl} alt="Cover" className="w-full h-full object-contain drop-shadow-xl" />
              </div>
              
              {/* Carosello orizzontale scrollabile (Solo CSS) */}
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-2 p-3 hide-scrollbar">
                {screenshots.map((img: string, i: number) => (
                  <div key={i} className="w-20 h-20 shrink-0 bg-slate-50 rounded-lg border border-slate-200 p-2 snap-center hover:border-red-500 cursor-pointer transition-colors">
                    <img src={img} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            </div>

            {/* IL PATCHER / DOWNLOAD ZONE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 mb-2">Play this Hack</h3>
              <p className="text-xs text-slate-500 font-medium mb-4">You need a clean <strong className="text-slate-700">{baseEngine}</strong> ROM to play.</p>
              
              <div className="space-y-3">
               
              <PatcherModalWrapper 
                romName={rom['Hack Name']} 
                baseEngine={baseEngine} 
                patchUrl={rom['patch_url']} // <-- CAMBIA QUESTO! Deve essere identico al nome della colonna su Supabase
                />
                
                {mainLink && (
                  <a href={mainLink} target="_blank" rel="noopener noreferrer" 
                     className="block w-full text-center bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-3 rounded-xl transition-all text-xs uppercase tracking-wider">
                    Alternative Download
                        {rom['source_url'] && (
                        <a href={rom['source_url']} target="_blank" rel="noopener noreferrer" 
                            className="flex items-center justify-center gap-2 w-full text-slate-400 hover:text-slate-600 font-bold py-2 mt-2 transition-colors text-[10px] uppercase tracking-widest">
                            Official Project Page
                        </a>
                        )}
                  </a>
                )}
              </div>
            </div>

            {/* Specs Tecniche */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Technical Details</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <dt className="text-slate-500 font-medium">Version</dt>
                  <dd className="font-black text-slate-900">{rom['Latest Version'] || '1.0'}</dd>
                </div>
                {rom['Date Updated'] && (
                  <div className="flex justify-between items-center">
                    <dt className="text-slate-500 font-medium">Updated</dt>
                    <dd className="font-bold text-slate-700">{rom['Date Updated']}</dd>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <dt className="text-slate-500 font-medium">Language</dt>
                  <dd className="font-bold text-slate-700">{rom['Language (Base)'] || 'EN'}</dd>
                </div>
              </dl>
            </div>

            <ProgressTracker romId={Number(id)} />
          </div>
        </aside>

        {/* COLONNA DESTRA: Contenuto Principale */}
        <main className="flex-1 space-y-12 min-w-0">
          
          {/* Titolo e Autore */}
        <div className="border-b border-slate-200 pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            {rom['Hack Name']}
            </h1>
            {rom['is_community_archive'] && (
            <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border border-blue-200">
                Community Archive
            </span>
            )}
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-base">
            <p className="text-slate-500 font-medium">
            Created by <span className="text-slate-900 font-bold bg-slate-100 px-2 py-1 rounded-md">{rom['Name of Creator'] || 'Unknown'}</span>
            </p>
            
            {/* Link alla fonte originale (Il "Source" button legale) */}
            {rom['source_url'] && (
            <a href={rom['source_url']} target="_blank" rel="noopener noreferrer" 
                className="text-slate-500 hover:text-slate-900 font-bold text-sm flex items-center gap-1 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                Original Source
            </a>
            )}
       
            {discordLink && (
            <a 
                href={discordLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm shadow-[#5865F2]/20 transition-all active:scale-95"
            >
                {/* Icona SVG Discord ufficiale */}
                <svg 
                className="w-5 h-5 fill-current transition-transform group-hover:rotate-6" 
                viewBox="0 0 24 24"
                >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Join Community
            </a>
            )}

        </div>
        </div>

          {/* OVERVIEW E STORIA */}
  
        <section>
        <h2 className="text-xl font-black text-slate-900 mb-4">Overview</h2>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="prose prose-slate max-w-none text-slate-700 font-medium leading-relaxed p-6">
            {rom['Description'] ? (
                <div dangerouslySetInnerHTML={{ __html: rom['Description'] }} />
            ) : (
                <p>Welcome to the official page for <strong>{rom['Hack Name']}</strong>. This project modifies the original {baseEngine} experience.</p>
            )}
            </div>
            
            {/* NOTA LEGALE DI ARCHIVIO */}
            {rom['is_community_archive'] && (
            <div className="bg-slate-50 border-t border-slate-100 p-4">
                <p className="text-[11px] text-slate-500 italic leading-snug">
                <strong>Archival Note:</strong> This patch is hosted by Pokévault as part of our community archive. 
                All rights belong to <strong>{rom['Name of Creator']}</strong>. If you are the creator and wish 
                to manage this page or request its removal, please contact us at <a href="mailto:pokevault.project@gmail.com" className="text-blue-500 hover:underline">pokevault.project@gmail.com</a>.
                </p>
            </div>
            )}
        </div>
        </section>

          {/* FEATURES GRID */}
          <section>
            <h2 className="text-xl font-black text-slate-900 mb-4">Key Features</h2>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Gameplay & Difficulty</h3>
                  <p className="text-slate-900 font-bold text-lg">{rom['Hack Type & Difficulty'] || 'Standard'}</p>
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Regional Pokédex</h3>
                  <p className="text-slate-900 font-bold text-lg">{rom['Dex Type'] || 'Classic'} <span className="text-slate-500 text-sm">({rom['Catchable Pokemon'] || 'Unknown amount'})</span></p>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">All Enhancements</h3>
                <BadgeList text={rom['Feature Tags']} />
              </div>
            </div>
          </section>

          {/* CHANGELOG (Se presente) */}
          {rom['changelog'] && (
            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4">Latest Updates</h2>
              <div className="bg-slate-900 text-slate-300 rounded-2xl p-6 font-mono text-sm shadow-inner">
                <div className="text-white font-bold mb-3 pb-3 border-b border-slate-700">Version {rom['Latest Version']}</div>
                <div className="whitespace-pre-wrap">{rom['changelog']}</div>
              </div>
            </section>
          )}

          {/* MORE FROM CREATOR */}
          {creatorRoms && creatorRoms.length > 0 && (
            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-xl font-black text-slate-900 mb-6">More by {rom['Name of Creator']}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {creatorRoms.map((cRom) => (
                  <Link href={`/rom/${cRom.id}`} key={cRom.id} className="bg-white border border-slate-200 p-4 rounded-xl hover:border-red-500 hover:shadow-md transition-all group">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{cRom['Hack Of']?.split(',')[0]}</span>
                    <h4 className="font-bold text-slate-900 group-hover:text-red-600 line-clamp-1">{cRom['Hack Name']}</h4>
                    <span className="text-xs font-bold text-slate-500 mt-2 block">v{cRom['Latest Version'] || '1.0'}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* RECENSIONI */}
          <section className="pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Community Reviews</h2>
            <div className="space-y-4 mb-8">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-slate-900">{rev.nome_utente}</span>
                      <div className="text-yellow-400 text-sm tracking-widest">
                        {'★'.repeat(rev.voto)}<span className="text-slate-200">{'★'.repeat(5 - rev.voto)}</span>
                      </div>
                    </div>
                    <p className="text-slate-700 font-medium">{rev.commento}</p>
                  </div>
                ))
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center">
                  <p className="text-slate-500 font-medium">Be the first to review this hack!</p>
                </div>
              )}
            </div>
            
            <ReviewForm romId={Number(id)} />
          </section>

        </main>
      </div>
      
      {/* Utility CSS rapida per nascondere la scrollbar nativa del carosello e renderlo figo */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  )
}