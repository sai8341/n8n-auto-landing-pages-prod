import { useData } from '../context/DataContext'
import './Sidebar.css'

function Sidebar({ tabs, activeTab, setActiveTab, isOpen, setIsOpen }) {
    const { workflow, lastRefresh } = useData()

    return (
        <>
            <div
                className={`sidebar-backdrop ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
            />
            <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
                <div className="sidebar-header">
                    <div className="brand">
                        <span className="brand-icon">⚡</span>
                        <span className="brand-name">LeadFlow AI</span>
                    </div>
                    <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? '◀' : '▶'}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab(tab.id)
                                if (window.innerWidth <= 768) setIsOpen(false)
                            }}
                            title={tab.label}
                        >
                            <span className="nav-icon">{tab.icon}</span>
                            <span className="nav-label">{tab.label}</span>
                            {activeTab === tab.id && <span className="nav-indicator" />}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    {isOpen && workflow && (
                        <div className="workflow-badge">
                            <div className="workflow-badge-text">
                                <div className={`workflow-status ${workflow.active ? 'active' : 'inactive'}`}>
                                    <span className="status-dot" />
                                    <span>{workflow.active ? 'Active' : 'Inactive'}</span>
                                </div>
                                <span className="sidebar-meta">
                                    {lastRefresh ? `Updated ${lastRefresh.toLocaleTimeString()}` : ''}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    )
}

export default Sidebar
