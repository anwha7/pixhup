'use client'
import { useState } from 'react'

export default function RestoreTool({ credits }: { credits: number }) {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRestore() {
    if (!file) return
    setLoading(true)
    setError('')
    const formData = new FormData()
    formData.append('photo', file)

    const res = await fetch('/api/restore', { method: 'POST', body: formData })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
      return
    }
    setResult(data.image)
  }

  async function handleBuyCredits() {
    const res = await fetch('/api/checkout', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  return (
    <div className="card" style={{ marginTop: 24 }}>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />

      <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn" onClick={handleRestore} disabled={!file || loading || credits < 1}>
          {loading ? 'Restoring…' : 'Restore photo (1 credit)'}
        </button>
        <button className="btn btn-ghost" onClick={handleBuyCredits}>
          Buy 12 credits — $5
        </button>
      </div>

      {credits < 1 && <p style={{ color: 'var(--muted)', marginTop: 12 }}>Out of credits — buy more above.</p>}
      {error && <p style={{ color: '#e5484d', marginTop: 12 }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 20 }}>
          <img src={result} alt="Restored result" style={{ maxWidth: '100%', borderRadius: 3 }} />
          <a href={result} download="pixhup-restored.png" className="btn" style={{ marginTop: 12, display: 'inline-block' }}>
            Download
          </a>
        </div>
      )}
    </div>
  )
}
