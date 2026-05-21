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
      <div>
        <p>✅ Feedback submitted anonymously. Thank you!</p>
        <button type="button" onClick={() => setSubmitted(false)}>
          Submit another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Anonymous Feedback</h2>

      <label>
        Category
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label>
        Message
        <textarea
          placeholder="Write your feedback here..."
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  )
}
