import { useState, useEffect } from 'react'
import { useData } from './context/DataContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import DashboardOverview from './components/DashboardOverview'
import LeadForm from './components/LeadForm'
import ExecutionHistory from './components/ExecutionHistory'
import LeadTable from './components/LeadTable'
import WorkflowFlow from './components/WorkflowFlow'
import { LoadingSpinner, ErrorState } from './components/LoadingState'
import './App.css'

const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'leads', label: 'All Leads', icon: '👥' },
  { id: 'capture', label: 'Capture Lead', icon: '🎯' },
  { id: 'executions', label: 'Executions', icon: '⚡' },
  { id: 'workflow', label: 'Workflow', icon: '🔄' },
]

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)
  const { loading, error, refresh } = useData()

  // Handle mobile resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false)
      }
    };
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const renderContent = () => {
    if (loading) return <LoadingSpinner />
    if (error) return <ErrorState message={error} onRetry={refresh} />

    switch (activeTab) {
      case 'overview':
        return <DashboardOverview onNavigate={setActiveTab} />
      case 'leads':
        return <LeadTable />
      case 'capture':
        return <LeadForm />
      case 'executions':
        return <ExecutionHistory />
      case 'workflow':
        return <WorkflowFlow />
      default:
        return <DashboardOverview onNavigate={setActiveTab} />
    }
  }

  return (
    <div className="app-layout">
      <Sidebar
        tabs={TABS}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <main className={`main-content ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <Header
          activeTab={activeTab}
          tabs={TABS}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="page-content">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default App
