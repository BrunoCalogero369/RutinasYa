'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, ChevronRight } from 'lucide-react'
import { deleteClient } from '../../app/actions'
import { DeleteModal } from './DeleteModal'

// Definimos el tipo aquí rápido para no importar todo
type Client = {
  id: string
  name: string
  created_at: string | null
}

export function ClientCard({ client }: { client: Client }) {
  const router = useRouter()
  const [isPressed, setIsPressed] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleNavigation = () => {
    setIsPressed(true)
    // El delay de 100ms
    setTimeout(() => {
      router.push(`/client/${client.id}`)
    }, 100)
  }

  const handleDelete = async () => {
    const formData = new FormData()
    formData.append('id', client.id)
    await deleteClient(formData)
    setShowDeleteModal(false)
  }

return (
    <>
      <div 
        onClick={handleNavigation}
        className={`
          relative overflow-hidden group flex items-center justify-between p-5 
          bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 
          rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ease-out cursor-pointer
          ${isPressed ? 'scale-95 bg-slate-50 dark:bg-slate-700' : 'scale-100'}
        `}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-l-2xl" />

        <div className="flex items-center gap-4 pl-2">
          <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 font-bold">
            {client.name.charAt(0).toUpperCase()}
          </div>
          
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-white leading-tight">
              {client.name}
            </h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Ver Rutina</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* BOTÓN DE BORRAR: Ahora solo abre el modal */}
          <button 
            onClick={(e) => {
              e.stopPropagation() // Evita ir a la rutina
              setShowDeleteModal(true)
            }}
            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors z-10"
          >
            <Trash2 size={20} />
          </button>

          <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      <DeleteModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        clientName={client.name}
      />
    </>
  )
}