// utils/colors.ts

// Colori per i Giochi Base (Es. FireRed = Rosso, Emerald = Verde)
export function getEngineColor(engine: string): string {
    if (!engine) return 'bg-slate-100 text-slate-700 border-slate-200'
    
    const e = engine.toLowerCase()
    if (e.includes('fire') || e.includes('red') || e.includes('ruby')) 
      return 'bg-red-100 text-red-800 border-red-200'
    if (e.includes('leaf') || e.includes('green') || e.includes('emerald')) 
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    if (e.includes('water') || e.includes('blue') || e.includes('sapphire')) 
      return 'bg-blue-100 text-blue-800 border-blue-200'
    if (e.includes('yellow') || e.includes('gold') || e.includes('heartgold')) 
      return 'bg-amber-100 text-amber-800 border-amber-200'
    if (e.includes('silver') || e.includes('crystal') || e.includes('platinum') || e.includes('diamond')) 
      return 'bg-cyan-100 text-cyan-800 border-cyan-200'
    if (e.includes('black') || e.includes('white')) 
      return 'bg-zinc-800 text-zinc-100 border-zinc-700'
    
    return 'bg-slate-100 text-slate-700 border-slate-200' // Default
  }
  
  // Colori per le Feature (Es. Difficoltà = Arancione, QoL = Verde acqua)
  export function getFeatureColor(feature: string): string {
    if (!feature) return 'bg-slate-100 text-slate-700 border-slate-200'
  
    const f = feature.toLowerCase()
    
    // 1. Difficoltà e Sfide (Arancione/Rosso)
    if (f.includes('difficulty') || f.includes('kaizo') || f.includes('hard') || f.includes('nuzlocke')) {
      return 'bg-orange-100 text-orange-800 border-orange-200'
    }
    // 2. Quality of Life & Facilitazioni (Verde Acqua)
    if (f.includes('qol') || f.includes('exp') || f.includes('iv') || f.includes('ev') || f.includes('tm') || f.includes('hm') || f.includes('run') || f.includes('fix')) {
      return 'bg-teal-100 text-teal-800 border-teal-200'
    }
    // 3. Meccaniche di Lotta & Typing (Blu)
    if (f.includes('split') || f.includes('type') || f.includes('move') || f.includes('stat') || f.includes('abilit') || f.includes('mega') || f.includes('fairy')) {
      return 'bg-sky-100 text-sky-800 border-sky-200'
    }
    // 4. Nuovi Contenuti & Storia (Viola)
    if (f.includes('story') || f.includes('region') || f.includes('graphic') || f.includes('music') || f.includes('item') || f.includes('location') || f.includes('event')) {
      return 'bg-purple-100 text-purple-800 border-purple-200'
    }
    
    // Default (Grigio neutro)
    return 'bg-slate-100 text-slate-700 border-slate-200'
  }