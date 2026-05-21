import { useState } from 'react'
import { supabase } from './supabaseClient'

const CATEGORIES = ['General', 'Bug Report', 'Feature Request', 'Complaint', 'Praise']

export default function FeedbackForm() {
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('General')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('feedback').insert({ message, category })

    setLoading(false)

    if (error) {
      alert(error.message || 'An error occurred')
      return
    }

    setSubmitted(true)
    setMessage('')
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div className="card" style={{ maxWidth: 480, width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48 }}>✅</div>
            <h2 style={{ fontSize: 20, margin: '12px 0 6px' }}>Thank you!</h2>
            <p style={{ color: '#6b7280' }}>Your feedback has been submitted anonymously.</p>
          </div>

          <div style={{ textAlign: 'center', marginTop: 18 }}>
            <button type="button" className="btn-secondary" onClick={() => setSubmitted(false)}>
              Submit another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ maxWidth: 480, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 48 }}>💬</div>
          <h1 style={{ color: '#1a1a2e', fontSize: 24, marginBottom: 4 }}>Share Your Feedback</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>100% anonymous — no account needed</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Category</label>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Message</label>
            <textarea
              className="input"
              placeholder="Write your feedback here..."
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div style={{ marginTop: 6 }}>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
