import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'
import { X, Sparkles } from 'lucide-react'

const CATEGORIES = ['work', 'personal', 'health', 'learning', 'creative']
const PRIORITIES = ['high', 'medium', 'low']
const KANBAN_COLS = [
  { id: 'todo', label: 'To Do' },
  { id: 'inprogress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
]

const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

const modalVariants = {
  initial: { opacity: 0, y: 60, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 350, damping: 30 } },
  exit: { opacity: 0, y: 40, scale: 0.97, transition: { duration: 0.2 } },
}

export default function TaskModal({ onClose, initialTask = null }) {
  const addTask = useAppStore((s) => s.addTask)
  const updateTask = useAppStore((s) => s.updateTask)

  const [form, setForm] = useState({
    title: initialTask?.title || '',
    description: initialTask?.description || '',
    priority: initialTask?.priority || 'medium',
    category: initialTask?.category || 'personal',
    dueDate: initialTask?.dueDate || new Date().toISOString().split('T')[0],
    kanbanCol: initialTask?.kanbanCol || 'todo',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    if (initialTask) {
      updateTask(initialTask.id, form)
    } else {
      addTask(form)
    }
    onClose()
  }

  return (
    <motion.div
      variants={overlayVariants}
      initial="initial" animate="animate" exit="exit"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <motion.div
        variants={modalVariants}
        initial="initial" animate="animate" exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{
          width: '100%', maxWidth: 520,
          padding: 28,
          background: 'var(--bg-surface)',
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent), var(--color-mint-300))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={16} color="white" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)', flex: 1 }}>
            {initialTask ? 'Edit Task' : 'New Task'}
          </h2>
          <button className="btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Title */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Task Title *
            </label>
            <input
              className="input"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="What do you want to accomplish?"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Notes
            </label>
            <textarea
              className="input"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Add details, context, or steps…"
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Row: Priority + Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Priority
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                {PRIORITIES.map((p) => {
                  const colors = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' }
                  const active = form.priority === p
                  return (
                    <button
                      key={p} type="button"
                      onClick={() => set('priority', p)}
                      style={{
                        flex: 1, padding: '7px 0', borderRadius: 8, border: `1.5px solid`,
                        borderColor: active ? colors[p] : 'var(--border)',
                        background: active ? `${colors[p]}20` : 'transparent',
                        color: active ? colors[p] : 'var(--text-muted)',
                        fontSize: 11, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize',
                        transition: 'all 0.15s',
                      }}
                    >
                      {p}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Category
              </label>
              <select
                className="input"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                style={{ fontSize: 13, textTransform: 'capitalize' }}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Row: Due Date + Kanban */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Due Date
              </label>
              <input
                type="date"
                className="input"
                value={form.dueDate}
                onChange={(e) => set('dueDate', e.target.value)}
                style={{ fontSize: 13, colorScheme: 'dark' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Board Column
              </label>
              <select
                className="input"
                value={form.kanbanCol}
                onChange={(e) => set('kanbanCol', e.target.value)}
                style={{ fontSize: 13 }}
              >
                {KANBAN_COLS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            className="btn btn-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ marginTop: 4, width: '100%', padding: '12px', fontSize: 15, borderRadius: 12 }}
          >
            {initialTask ? 'Save Changes' : '✨ Create Task'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  )
}
