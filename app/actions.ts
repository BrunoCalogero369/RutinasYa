'use server'

import { createClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function addClient(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string

  if (!name) return

  const { data, error } = await supabase
    .from('clients')
    .insert({ name })
    .select() // Esto nos devuelve el objeto creado para confirmar

  if (error) {
    // Esto lo verás en la terminal de VS Code, no en el navegador
    console.error("ERROR DE SUPABASE:", error.message)
    return
  }

  console.log("CLIENTE CREADO:", data)
  revalidatePath('/')
}

export async function deleteClient(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)

  if (error) {
    console.error("Error al borrar:", error)
    return
  }

  revalidatePath('/')
}