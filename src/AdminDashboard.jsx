import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import FeedbackItem from './FeedbackItem'

export default function AdminDashboard({ session }) {
  const [feedback, setFeedback] = useState([])
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  async function fetchFeedback() {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      alert(error.message || 'Failed to fetch feedback')
      return
    }

    setFeedback(data || [])
  }

  useEffect(() => {
    fetchFeedback()

    const channel = supabase
      .channel('feedback-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'feedback' },
        () => {
          fetchFeedback()
        }
      )

    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  function handleUpdate(id, is_reviewed) {
    setFeedback((prev) => prev.map((it) => (it.id === id ? { ...it, is_reviewed } : it)))
  }

  function handleDelete(id) {
    setFeedback((prev) => prev.filter((it) => it.id !== id))
  }

  const categories = ['All', ...Array.from(new Set(feedback.map((f) => f.category).filter(Boolean)))]

  const filtered = feedback.filter((it) => {
    if (filterCategory !== 'All' && it.category !== filterCategory) return false
    if (filterStatus === 'Reviewed' && !it.is_reviewed) return false
    if (filterStatus === 'Pending' && it.is_reviewed) return false
    return true
  })

  return (
    <div className="container">
      <div className="header-row">
        <h2>Admin Dashboard</h2>
        <div>
          <button type="button" className="btn" onClick={() => supabase.auth.signOut()}>
            Sign Out
          </button>
        </div>
      </div>

      <p className="meta">Signed in as: {session?.user?.email}</p>

      <div className="filters">
        <label>
          Category:{' '}
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label>
          Status:{' '}
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Pending">Pending</option>
          </select>
        </label>
      </div>

      <p className="meta">Showing {filtered.length} item{filtered.length !== 1 ? 's' : ''}</p>

      <div className="feedback-list">
        {filtered.map((item) => (
          <FeedbackItem key={item.id} item={item} onUpdate={handleUpdate} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  )
}
