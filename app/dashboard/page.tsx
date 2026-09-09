import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'
import RestoreTool from './RestoreTool'

export default async function Dashboard() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', user.id)
    .single()

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '60px 24px' }}>
      <h1 style={{ fontSize: 28 }}>Restore a photo</h1>
      <p style={{ color: 'var(--muted)', marginTop: 8 }}>Credits left: {profile?.credits ?? 0}</p>
      <RestoreTool credits={profile?.credits ?? 0} />
    </main>
  )
}
