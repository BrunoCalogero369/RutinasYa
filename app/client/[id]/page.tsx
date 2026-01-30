import { createClient } from '@/lib/supabase'
import { saveRoutine } from './actions'
import Link from 'next/link'

export default async function ClientPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ day?: string }> 
}) {
  const { id } = await params
  const { day } = await searchParams
  
  const selectedDay = parseInt(day || '1') 
  const supabase = await createClient()

  // Obtenemos el nombre del cliente y la rutina del día seleccionado
  const { data: client } = await supabase.from('clients').select('name').eq('id', id).single()
  const { data: routine } = await supabase
    .from('routines')
    .select('content')
    .eq('client_id', id)
    .eq('day_of_week', selectedDay)
    .single()

  const days = [
    { n: 1, label: 'Lun' }, { n: 2, label: 'Mar' }, { n: 3, label: 'Mie' },
    { n: 4, label: 'Jue' }, { n: 5, label: 'Vie' }, { n: 6, label: 'Sab' },
  ]

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-4 py-8">
      {/* Navegación Superior */}
      <header className="flex items-center gap-4 mb-8 sticky top-0 z-20 py-2">
        <Link 
          href="/" 
          className="
            flex items-center justify-center w-10 h-10 
            bg-slate-200/80 dark:bg-slate-800/80 backdrop-blur-md 
            rounded-full text-slate-600 dark:text-slate-200 
            hover:bg-white dark:hover:bg-slate-700 hover:scale-110 
            transition-all shadow-sm border border-black/5
          "
        >
          {/* Icono de flecha atrás (puedes usar Lucide <ArrowLeft /> o este SVG simple) */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        
        <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight line-clamp-1">
          {client?.name}
        </h1>
      </header>

      {/* Selector de Días tipo "Control de Segmentos" */}
      <div className="flex gap-1 mb-6 bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl sticky top-4 z-10 shadow-sm">
        {days.map((d) => (
          <Link
            key={d.n}
            href={`?day=${d.n}`}
            className={`flex-1 text-center py-3 rounded-xl text-sm font-bold transition-all ${
              selectedDay === d.n 
                ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm scale-105' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {d.label}
          </Link>
        ))}
      </div>

      {/* Editor de Rutina */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        <form action={async (formData: FormData) => {
          'use server'
          const content = formData.get('content') as string
          await saveRoutine(id, selectedDay, content)
        }}>
          <div className="flex justify-between items-center mb-6">
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
              Rutina: {days.find(d => d.n === selectedDay)?.label}
            </span>
          </div>

          <textarea 
            name="content"
            key={`${id}-${selectedDay}`} // Truco Pro: limpia el textarea al cambiar de día
            defaultValue={routine?.content || ''}
            placeholder="Introduce los ejercicios aquí..."
            className="w-full h-[400px] bg-transparent text-slate-700 dark:text-slate-200 text-xl leading-relaxed focus:outline-none resize-none placeholder:text-slate-300 dark:placeholder:text-slate-700 font-medium"
            autoFocus
          />

          <button 
            type="submit"
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] transition-all active:scale-[0.96] shadow-lg shadow-blue-500/20"
          >
            Guardar Rutina
          </button>
        </form>
      </section>
    </main>
  )
}