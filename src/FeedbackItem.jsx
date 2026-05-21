import { supabase } from './supabaseClient'

export default function FeedbackItem({ item, onUpdate, onDelete }) {
  async function toggleReviewed() {
    const { error } = await supabase
      .from('feedback')
      .update({ is_reviewed: !item.is_reviewed })
      .eq('id', item.id)

    if (error) {
      alert(error.message || 'Failed to update')
      return
    }

    if (onUpdate) onUpdate(item.id, !item.is_reviewed)
  }

  async function handleDelete() {
    const ok = confirm('Delete this feedback?')
    if (!ok) return

    const { error } = await supabase.from('feedback').delete().eq('id', item.id)

    if (error) {
      alert(error.message || 'Failed to delete')
      return
    }

    if (onDelete) onDelete(item.id)
  }

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ background: '#ede9fe', color: '#6c63ff', padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{item.category}</span>
        <span style={{ color: '#9ca3af', fontSize: 12 }}>{item.created_at ? new Date(item.created_at).toLocaleString() : 'Unknown'}</span>
      </div>

      <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.6, margin: '0 0 12px 0' }}>{item.message}</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {item.is_reviewed ? (
            <span className="badge-reviewed">✅ Reviewed</span>
          ) : (
            <span className="badge-pending">🕐 Pending</span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={toggleReviewed} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 13 }}>
            {item.is_reviewed ? 'Mark as Pending' : 'Mark as Reviewed'}
          </button>

          <button type="button" onClick={handleDelete} className="btn-danger" style={{ padding: '6px 14px', fontSize: 13 }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
