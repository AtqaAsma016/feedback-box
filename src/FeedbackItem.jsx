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
    <div className="card feedback-item">
      <div>
        <strong>Category:</strong> {item.category}
      </div>

      <div>
        <strong>Message:</strong>
        <div>{item.message}</div>
      </div>

      <div className="meta">
        <strong>Submitted:</strong>{' '}
        {item.created_at ? new Date(item.created_at).toLocaleString() : 'Unknown'}
      </div>

      <div className="meta">
        <strong>Status:</strong>{' '}
        {item.is_reviewed ? '✅ Reviewed' : '🕐 Pending'}
      </div>

      <div style={{ marginTop: '8px' }}>
        <button type="button" onClick={toggleReviewed} className="btn">
          {item.is_reviewed ? 'Mark as Pending' : 'Mark as Reviewed'}
        </button>

        <button type="button" onClick={handleDelete} className="btn btn-danger" style={{ marginLeft: 8 }}>
          Delete
        </button>
      </div>
    </div>
  )
}
