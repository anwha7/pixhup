'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    setSent(true)
  }

  if (sent) {
    return (
      <main style={{ maxWidth: 400, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <p>Check your email for a sign-in link.</p>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 400, margin: '80px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Sign in</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginBottom: 12 }}
        />
        <button type="submit" className="btn" style={{ width: '100%' }}>
          Send sign-in link
        </button>
      </form>
    </main>
  )
}
