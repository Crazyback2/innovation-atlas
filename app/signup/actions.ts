'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/server'

export async function signup(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const fullName = String(formData.get('full_name') ?? '').trim()

  if (!email || !password || !fullName) {
    redirect('/signup?error=' + encodeURIComponent('Compila tutti i campi.'))
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })

  if (error) {
    redirect('/signup?error=' + encodeURIComponent(error.message))
  }

  if (!data.session) {
    redirect(
      '/login?message=' +
        encodeURIComponent('Account creato. Controlla la tua email per confermarlo, poi accedi.')
    )
  }

  revalidatePath('/', 'layout')
  redirect('/')
}