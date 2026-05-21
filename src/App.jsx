import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import FeedbackForm from './FeedbackForm'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

function App() {
  const [session, setSession] = useState(undefined)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (session === undefined) return <p>Loading...</p>

  if (session) return <AdminDashboard session={session} />

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <div style={{ background: '#fff', padding: '14px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#6c63ff' }}>💬 FeedbackBox</span>

        <div>
          {!showLogin && (
            <button type="button" className="btn-secondary" style={{ padding: '6px 16px', fontSize: 13 }} onClick={() => setShowLogin(true)}>
              Admin
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <FeedbackForm />
      </div>

      {showLogin && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ position: 'relative' }}>
            <button type="button" onClick={() => setShowLogin(false)} style={{ position: 'absolute', top: -12, right: -12, background: '#fff', borderRadius: '50%', width: 32, height: 32, border: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
            <AdminLogin />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
