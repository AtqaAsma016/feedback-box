import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message || 'An error occurred')
    }
  }
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5', padding: 20 }}>
      <div className="card" style={{ maxWidth: 400, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 48 }}>🔐</div>
          <h2 style={{ color: '#1a1a2e', marginTop: 8 }}>Admin Login</h2>
          <p style={{ fontSize: 14, color: '#6b7280' }}>Restricted access only</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email</label>
            <input
              className="input"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Password</label>
            <input
              className="input"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Sign In</button>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', color: '#dc2626', padding: 10, borderRadius: 8, fontSize: 14, marginTop: 8 }}>
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
