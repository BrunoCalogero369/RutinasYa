'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  // Inicializamos el estado intentando leer de localStorage de una vez
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const MASTER_PASSWORD = process.env.NEXT_PUBLIC_APP_PASSWORD

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('trainer_auth')
      
      setTimeout(() => {
        if (auth === 'true') {
          setIsAuthenticated(true)
        }
        setIsLoading(false)
      }, 0)
    }

    checkAuth()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === MASTER_PASSWORD) {
      localStorage.setItem('trainer_auth', 'true')
      // React detectará el cambio de estado y Framer Motion ejecutará el 'exit' del login
      setIsAuthenticated(true)
      setError(false)
    } else {
      setError(true)
      setPassword('')
    }
  }

  // Mantenemos el loading fuera para evitar parpadeos iniciales
  if (isLoading) {
    return <div className="min-h-screen bg-slate-900" />
  }

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated ? (
        // --- ESTADO 1: PANTALLA DE BLOQUEO ---
        <motion.div 
          key="lock-screen"
          // Exit: Se va hacia arriba (-100vh) simulando deslizar el dedo
          exit={{ y: -1000, opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-slate-900 flex items-center justify-center px-4 fixed inset-0 z-50"
        >
          <div className="max-w-sm w-full bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                Trainer<span className="text-blue-500">Pro</span>
              </h1>
              <p className="text-slate-400 text-sm mt-2">Acceso restringido</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Introduce la clave..."
                className={`w-full px-5 py-4 rounded-2xl bg-slate-900 border ${error ? 'border-red-500' : 'border-slate-700'} text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                autoFocus
              />
              {error && <p className="text-red-500 text-xs text-center font-bold">Contraseña incorrecta</p>}
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest hover:bg-blue-700 transition-all"
              >
                Entrar
              </button>
            </form>
          </div>
        </motion.div>
      ) : (
        // --- ESTADO 2: CONTENIDO DE LA APP ---
        <motion.div
          key="app-content"
          // Initial: Aparece escalando desde el fondo (Zoom In)
          initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}