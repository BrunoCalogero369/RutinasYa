'use server'

import { createClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function saveRoutine(clientId: string, day: number, content: string) {
  const supabase = await createClient()

  // El upsert detecta automáticamente el par (client_id, day_of_week) 
  // gracias al índice UNIQUE que creamos en SQL.
  const { error } = await supabase
    .from('routines')
    .upsert({ 
      client_id: clientId, 
      day_of_week: day, 
      content: content 
    }, { onConflict: 'client_id, day_of_week' })

  if (error) {
    console.error("Error al guardar:", error.message)
    return
  }

  // Refrescamos la página para que la data sea persistente
  revalidatePath(`/client/${clientId}`)
}