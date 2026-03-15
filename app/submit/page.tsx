'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/utils/supabase'
import { useState } from 'react'

const formSchema = z.object({
    hackName: z.string().min(2, "Name is required"),
    creator: z.string().min(2, "Creator is required"),
    hackOf: z.string().min(1, "Base ROM is required"),
    language: z.string().min(1),
    version: z.string().min(1),
    dateUpdated: z.string().optional(),
    status: z.string().min(1),
    scale: z.string().optional(),
    dexType: z.string().optional(),
    catchableCount: z.string().optional(),
    difficulty: z.string().optional(),
    tags: z.string().optional(),
    description: z.string().min(10, "Description is too short"),
    linkToHack: z.string().url("Must be a valid URL"),
    secondaryLink: z.string().url().optional().or(z.literal('')),
    // Questi restano opzionali come formato stringa...
    discord: z.string().optional().or(z.literal('')),
    sourceUrl: z.string().optional().or(z.literal('')),
    isArchive: z.boolean(),
  }).refine((data) => data.discord || data.sourceUrl, {
    // ...ma questa regola impone che almeno uno dei due esista
    message: "You must provide either a Discord link or an Original Source link.",
    path: ["discord"], // L'errore verrà associato al campo discord
  });

type FormData = z.infer<typeof formSchema>

export default function SubmitHack() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hackName: "", creator: "", hackOf: "FireRed", language: "English",
      version: "v1.0", dateUpdated: new Date().toISOString().split('T')[0],
      status: "Completed", scale: "Full Region", dexType: "National",
      catchableCount: "", difficulty: "Standard", tags: "",
      description: "", linkToHack: "", secondaryLink: "",
      discord: "", sourceUrl: "", isArchive: false
    }
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('ROMS').insert([{
        "Hack Name": data.hackName,
        "Name of Creator": data.creator,
        "Hack Of": data.hackOf,
        "Language (Base)": data.language,
        "Latest Version": data.version,
        "Date Updated": data.dateUpdated,
        "Completion Status": data.status,
        "Scale": data.scale,
        "Dex Type": data.dexType,
        "Catchable Pokemon": data.catchableCount,
        "Hack Type & Difficulty": data.difficulty,
        "Feature Tags": data.tags,
        "Description": data.description,
        "Link to Hack": data.linkToHack,
        "Secondary Link": data.secondaryLink,
        "Link to Discord": data.discord,
        "source_url": data.sourceUrl,
        "is_community_archive": data.isArchive,
        "is_approved": false
      }])

      if (error) throw error
      setMessage("✅ Success! Hack submitted for approval.")
      reset()
    } catch (err: any) {
      setMessage("❌ Error: " + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Submit New Hack</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          
          {/* --- SECTION: GENERAL --- */}
          <div className="space-y-4 col-span-full border-b pb-4"><h2 className="font-black uppercase text-slate-400 text-sm tracking-widest">General Info</h2></div>
          
          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-2">Hack Name *</label>
            <input {...register('hackName')} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="e.g. Unbound" />
            {errors.hackName && <p className="text-red-500 text-[10px] mt-1 uppercase font-bold">{errors.hackName.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-2">Creator Name *</label>
            <input {...register('creator')} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="e.g. Skeli" />
          </div>

          {/* --- SECTION: TECHNICAL --- */}
          <div className="space-y-4 col-span-full border-b pb-4 pt-4"><h2 className="font-black uppercase text-slate-400 text-sm tracking-widest">Technical details</h2></div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-2">Hack Of (Base ROM) *</label>
            <select {...register('hackOf')} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50">
              <option value="FireRed">FireRed</option>
              <option value="Emerald">Emerald</option>
              <option value="Platinum">Platinum</option>
              <option value="Black">Black</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-2">Completion Status</label>
            <select {...register('status')} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50">
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Beta/Demo">Beta/Demo</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-2">Version</label>
              <input {...register('version')} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="1.0" />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-2">Language</label>
              <input {...register('language')} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-2">Date Updated</label>
            <input type="date" {...register('dateUpdated')} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" />
          </div>

          {/* --- SECTION: GAMEPLAY --- */}
          <div className="space-y-4 col-span-full border-b pb-4 pt-4"><h2 className="font-black uppercase text-slate-400 text-sm tracking-widest">Gameplay features</h2></div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-2">Scale / Region</label>
            <input {...register('scale')} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="e.g. New Region, Kanto+" />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-2">Dex Type</label>
            <input {...register('dexType')} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="e.g. National (Gen 1-8)" />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-2">Catchable Pokemon (Amount)</label>
            <input {...register('catchableCount')} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="e.g. 809" />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-2">Type & Difficulty</label>
            <input {...register('difficulty')} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="e.g. Hardcore Nuzlocke" />
          </div>

          <div className="col-span-full">
            <label className="block text-xs font-black uppercase text-slate-500 mb-2">Feature Tags (comma separated)</label>
            <input {...register('tags')} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="Mega Evolution, DexNav, New Story" />
          </div>

          <div className="col-span-full">
            <label className="block text-xs font-black uppercase text-slate-500 mb-2">Description *</label>
            <textarea {...register('description')} rows={4} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="Explain what makes this hack unique..." />
          </div>

          {/* --- SECTION: LINKS --- */}
          <div className="space-y-4 col-span-full border-b pb-4 pt-4"><h2 className="font-black uppercase text-slate-400 text-sm tracking-widest">Links & Files</h2></div>

          <div className="col-span-full">
            <label className="block text-xs font-black uppercase text-slate-500 mb-2">Main Patch Link (.bps / .ips) *</label>
            <input {...register('linkToHack')} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="URL to the file" />
          </div>


            <div className="space-y-4 col-span-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-2">Discord Link</label>
                <input {...register('discord')} className={`w-full p-3 rounded-xl border ${errors.discord ? 'border-red-500' : 'border-slate-200'} bg-slate-50`} placeholder="https://discord.gg/..." />
                </div>

                <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-2">Original Source (Thread/Site)</label>
                <input {...register('sourceUrl')} className={`w-full p-3 rounded-xl border ${errors.discord ? 'border-red-500' : 'border-slate-200'} bg-slate-50`} placeholder="e.g. PokéCommunity thread" />
                </div>
            </div>
            
            {/* Messaggio d'errore specifico per la validazione combinata */}
            {errors.discord && (
                <p className="text-red-600 text-xs font-bold uppercase tracking-tight">
                ⚠️ {errors.discord.message}
                </p>
            )}
            </div>

          <div className="col-span-full p-4 bg-slate-900 rounded-2xl flex items-center gap-3">
            <input type="checkbox" {...register('isArchive')} className="w-6 h-6 accent-red-600" />
            <span className="text-white font-bold text-sm italic">This is a community re-upload (Archive)</span>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="col-span-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-[0_4px_0_0_#991b1b] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest"
          >
            {isSubmitting ? 'Sending to Vault...' : 'Publish to Pokévault'}
          </button>

          {message && <p className="col-span-full text-center font-bold text-slate-800 p-4 bg-white border border-slate-200 rounded-xl">{message}</p>}
        </form>
      </div>
    </div>
  )
}