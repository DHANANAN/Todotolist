import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import TaskCard from '../components/tasks/TaskCard'
import MindfulSnippet from '../components/mindful/MindfulSnippet'
import TaskModal from '../components/tasks/TaskModal'
import { Plus, CheckCircle2, Clock, Flame } from 'lucide-react'

const today = () => new Date().toISOString().split('T')[0]

const GREETINGS = ['Good morning', 'Good afternoon', 'Good evening']
const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? GREETINGS[0] : h < 18 ? GREETINGS[1] : GREETINGS[2]
}

export default function DailyView() {
  const { tasks, toggleTask, getStats } = useAppStore()
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('all')

  const stats = getStats()
  const date = today()
  const todayTasks = tasks.filter((t) => t.dueDate === date)

  const filtered = filter === 'all' ? todayTasks
    : filter === 'active' ? todayTasks.filter((t) => !t.completed)
    : todayTasks.filter((t) => t.completed)

  const completedCount = todayTasks.filter((t) => t.completed).length
  const progress = todayTasks.length ? (completedCount / todayTasks.length) * 100 : 0

  const dayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Greeting card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{
          padding: '28px 32px', marginBottom: 24,
          background: 'linear-gradient(135deg, var(--accent) 0%, #6D28D9 50%, #4F46E5 100%)',
          border: 'none', color: 'white',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', right: -40, top: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', right: 60, bottom: -60, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <p style={{ fontSize: 12, opacity: 0.75, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>{dayLabel}</p>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 26, marginBottom: 16 }}>
          {greeting()}, {useAppStore.getState().currentUser?.name || 'Friend'} 👋
        </h2>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            { icon: CheckCircle2, label: 'Completed', value: `${completedCount}/${todayTasks.length}` },
            { icon: Clock, label: 'Remaining', value: todayTasks.filter((t) => !t.completed).length },
            { icon: Flame, label: 'Streak', value: `${stats.streak} days` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon size={16} style={{ opacity: 0.8 }} />
              <div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {todayTasks.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.75, marginBottom: 6 }}>
              <span>Daily Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 99, height: 6 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                style={{ height: '100%', background: 'white', borderRadius: 99 }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Tasks section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
        <div>
          {/* Filter + Add row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 3 }}>
              {['all', 'active', 'completed'].map((f) => (
                <button
                  key={f} onClick={() => setFilter(f)}
                  style={{
                    padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
                    background: filter === f ? 'var(--accent)' : 'transparent',
                    color: filter === f ? 'white' : 'var(--text-muted)',
                    transition: 'all 0.15s',
                  }}
                >{f}</button>
              ))}
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
              style={{ fontSize: 12, padding: '7px 14px', gap: 5, marginLeft: 'auto' }}
            >
              <Plus size={13} /> Add Task
            </button>
          </div>

          {/* Task list */}
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{
                  textAlign: 'center', padding: '48px 24px',
                  color: 'var(--text-muted)', fontSize: 14,
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>
                  {filter === 'completed' ? '🏆' : '✨'}
                </div>
                {filter === 'completed' ? 'No completed tasks yet. Keep going!' : 'Your day is clear. Add a task to get started!'}
              </motion.div>
            ) : (
              filtered.map((task) => <TaskCard key={task.id} task={task} />)
            )}
          </AnimatePresence>
        </div>

        {/* Mindful snippet sidebar */}
        <div style={{ width: 300, position: 'sticky', top: 24 }}>
          <MindfulSnippet />
        </div>
      </div>

      <AnimatePresence>
        {showModal && <TaskModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  )
}
