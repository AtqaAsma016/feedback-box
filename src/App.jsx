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
    <div>
      <FeedbackForm />
      {showLogin ? (
        <AdminLogin />
      ) : (
        <button type="button" onClick={() => setShowLogin(true)}>
          Admin Login
        </button>
      )}
    </div>
  )
}

export default App
