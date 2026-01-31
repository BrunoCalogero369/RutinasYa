'use client'

import { AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  clientName: string
}

export function DeleteModal({ isOpen, onClose, onConfirm, clientName }: DeleteModalProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop con blur animado */}
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40"
          />

          {/* Modal estilo iOS Spring */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[32px] p-8 shadow-2xl border border-white/20 z-10 overflow-hidden"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black dark:text-white uppercase italic">¿Eliminar atleta?</h3>
              <p className="text-slate-500 mt-2">Vas a borrar a <b>{clientName}</b>. Esta acción no tiene vuelta atrás.</p>
            </div>

            <div className="flex flex-col gap-3 mt-8">
              <button onClick={onConfirm} className="w-full bg-red-500 text-white font-bold py-4 rounded-2xl active:scale-95 transition-transform">
                ELIMINAR
              </button>
              <button onClick={onClose} className="w-full bg-slate-100 dark:bg-slate-800 dark:text-white font-bold py-4 rounded-2xl active:scale-95 transition-transform">
                CANCELAR
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}