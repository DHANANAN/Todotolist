import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from './store/useAppStore'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import DailyView from './views/DailyView'
import WeeklyView from './views/WeeklyView'
import MonthlyView from './views/MonthlyView'
import KanbanView from './views/KanbanView'
import CalendarView from './views/CalendarView'
import AnalyticsView from './views/AnalyticsView'

const views = {
  daily: DailyView,
  weekly: WeeklyView,
  monthly: MonthlyView,
  kanban: KanbanView,
  calendar: CalendarView,
  analytics: AnalyticsView,
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

export default function App() {
  const currentView = useAppStore((s) => s.currentView)
  const ViewComponent = views[currentView] || DailyView

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="page-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ViewComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
