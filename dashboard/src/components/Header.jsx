import { useData } from '../context/DataContext'
import './Header.css'

function Header({ activeTab, tabs, toggleSidebar }) {
    const { stats, workflow, lastRefresh, refresh } = useData()
    const currentTab = tabs.find((t) => t.id === activeTab)

    return (
        <header className="header">
            <div className="header-left">
                <button className="menu-btn" onClick={toggleSidebar}>☰</button>
                <div className="header-title-group">
                    <h1 className="header-title">{currentTab?.icon} {currentTab?.label}</h1>
                    <span className="header-breadcrumb">
                        {workflow?.name || 'Loading...'} / {currentTab?.label}
                    </span>
                </div>
            </div>
            <div className="header-right">
                <div className="header-stat">
                    <span className="header-stat-value">{stats?.totalExecutions ?? '—'}</span>
                    <span className="header-stat-label">Executions</span>
                </div>
                <div className="header-stat success">
                    <span className="header-stat-value">{stats?.successCount ?? '—'}</span>
                    <span className="header-stat-label">Success</span>
                </div>
                <div className="header-stat error">
                    <span className="header-stat-value">{stats?.errorCount ?? '—'}</span>
                    <span className="header-stat-label">Errors</span>
                </div>
                <button className="refresh-btn" onClick={refresh} title="Refresh data">
                    🔄
                </button>
                <div className="header-live-dot" title={lastRefresh ? `Last update: ${lastRefresh.toLocaleTimeString()}` : 'Loading...'}>
                    <span className="live-indicator" />
                    <span className="live-label">LIVE</span>
                </div>
            </div>
        </header>
    )
}

export default Header
