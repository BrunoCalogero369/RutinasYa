import { createClient } from '@/lib/supabase'
import { addClient } from './actions'
import { ClientCard } from '@/components/ClientCard' 

export default async function HomePage() {
  const supabase = await createClient()
  
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen w-full max-w-2xl mx-auto px-4 py-8 md:py-12 bg-slate-50/50 dark:bg-black/10">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter italic uppercase">
            <span className="text-blue-600">Trainer</span>
            <span className="text-slate-900 dark:text-white">Pro</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">Panel de Atletas</p>
        </div>
      </header>

      {/* Input de Nuevo Cliente */}
      <section className="mb-8">
        <form action={addClient} className="relative">
          <input 
            name="name"
            placeholder="Nuevo atleta..."
            className="w-full pl-6 pr-32 py-4 rounded-2xl border-0 shadow-lg shadow-blue-500/10 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
            required
            autoComplete="off"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white font-bold px-6 rounded-xl hover:bg-blue-700 transition-all text-sm uppercase tracking-wide shadow-md"
          >
            Añadir
          </button>
        </form>
      </section>

      {/* Grid de Clientes Fachero */}
      <section className="space-y-3 pb-20">
        {clients?.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}

        {clients?.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <p className="text-slate-400">Sin atletas activos</p>
          </div>
        )}
      </section>
    </main>
  )
}