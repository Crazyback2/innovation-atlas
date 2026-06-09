'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/server'
import { VALID_SECTORS } from './data'

type ValidSector = (typeof VALID_SECTORS)[number]

export async function createConcept(
  formData: FormData,
): Promise<{ error: string } | void> {
  const title = String(formData.get('title') ?? '').trim()
  const sector = String(formData.get('sector') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()

  if (!title) {
    return { error: 'Inserisci un titolo per il concept.' }
  }

  if (!sector || !VALID_SECTORS.includes(sector as ValidSector)) {
    return { error: 'Seleziona un settore valido.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Devi essere autenticato per creare un concept.' }
  }

  const { error } = await supabase.from('concepts').insert({
    owner_id: user.id,
    title,
    sector,
    description: description || null,
  })

  if (error) {
    return { error: 'Impossibile creare il concept. Riprova più tardi.' }
  }

  revalidatePath('/concept')
  redirect('/concept')
}
