export default function Home() {
  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: 44 }}>Pixhup</h1>
      <p style={{ color: 'var(--muted)', marginTop: 16, fontSize: 17 }}>
        Restore, upscale, and colorize old photos with AI.
      </p>
      <a href="/login" className="btn" style={{ marginTop: 32, display: 'inline-block' }}>
        Sign in to try it
      </a>
    </main>
  )
}
