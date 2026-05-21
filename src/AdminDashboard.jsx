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

  const total = feedback.length
  const pending = feedback.filter((f) => !f.is_reviewed).length
  const reviewed = feedback.filter((f) => f.is_reviewed).length

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, background: '#fff', padding: '16px 24px', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <div>
          <h1 style={{ fontSize: 22, color: '#1a1a2e', margin: 0 }}>Admin Dashboard</h1>
        </div>

        <div style={{ textAlign: 'right' }}>
          <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>{session?.user?.email}</p>
          <div style={{ marginTop: 8 }}>
            <button type="button" className="btn-danger" style={{ padding: '8px 16px' }} onClick={() => supabase.auth.signOut()}>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <div className="card" style={{ padding: 16, textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#6c63ff' }}>{total}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Total</div>
        </div>

        <div className="card" style={{ padding: 16, textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#6c63ff' }}>{pending}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Pending</div>
        </div>

        <div className="card" style={{ padding: 16, textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#6c63ff' }}>{reviewed}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Reviewed</div>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20, padding: 16 }}>
        <div style={{ fontWeight: 600, color: '#374151' }}>Filter by:</div>

        <select className="input" style={{ maxWidth: 180 }} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select className="input" style={{ maxWidth: 180 }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Pending">Pending</option>
        </select>

        <div style={{ marginLeft: 'auto' }}>
          <div style={{ background: '#ede9fe', color: '#6c63ff', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
            {filtered.length} shown
          </div>
        </div>
      </div>

      <div className="feedback-list">
        {filtered.map((item) => (
          <FeedbackItem key={item.id} item={item} onUpdate={handleUpdate} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  )
}
