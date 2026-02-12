import { useData } from '../context/DataContext'
import { formatDuration, timeAgo } from '../data/mockData'
import './DashboardOverview.css'

function DashboardOverview({ onNavigate }) {
    const { leads, executions, stats, workflow } = useData()

    const recentLeads = leads.slice(0, 4)
    const recentExecs = executions.slice(0, 5)

    return (
        <div className="dashboard animate-in">
            {/* Hero Stats */}
            <div className="stats-grid">
                <div className="stat-card hero-stat" onClick={() => onNavigate('leads')}>
                    <div className="stat-icon">👥</div>
                    <div className="stat-body">
                        <span className="stat-value">{stats.totalLeads}</span>
                        <span className="stat-label">Total Leads</span>
                    </div>
                    <span className="stat-trend">Live</span>
                </div>

                <div className="stat-card" onClick={() => onNavigate('leads')}>
                    <div className="stat-icon">✅</div>
                    <div className="stat-body">
                        <span className="stat-value" style={{ color: 'var(--success)' }}>
                            {stats.qualifiedCount}
                        </span>
                        <span className="stat-label">Qualified</span>
                    </div>
                    <span className="stat-trend">{stats.qualificationRate}%</span>
                </div>

                <div className="stat-card" onClick={() => onNavigate('leads')}>
                    <div className="stat-icon">❌</div>
                    <div className="stat-body">
                        <span className="stat-value" style={{ color: 'var(--error)' }}>
                            {stats.notQualifiedCount}
                        </span>
                        <span className="stat-label">Not Qualified</span>
                    </div>
                    <span className="stat-trend">{100 - stats.qualificationRate}%</span>
                </div>

                <div className="stat-card" onClick={() => onNavigate('executions')}>
                    <div className="stat-icon">⚡</div>
                    <div className="stat-body">
                        <span className="stat-value">{stats.totalExecutions}</span>
                        <span className="stat-label">Executions</span>
                    </div>
                    <span className="stat-trend">{stats.successCount} ok</span>
                </div>
            </div>

            {/* Mini Stats */}
            <div className="mini-stats-row">
                <div className="mini-stat">
                    <span className="mini-label">Avg Duration</span>
                    <span className="mini-value">{formatDuration(stats.avgDuration)}</span>
                </div>
                <div className="mini-stat">
                    <span className="mini-label">Total Tokens Used</span>
                    <span className="mini-value">{stats.totalTokens.toLocaleString()}</span>
                </div>
                <div className="mini-stat">
                    <span className="mini-label">AI Model</span>
                    <span className="mini-value">gpt-4o-mini</span>
                </div>
                <div className="mini-stat">
                    <span className="mini-label">Storage</span>
                    <span className="mini-value">Google Sheets</span>
                </div>
            </div>

            {/* Two-Column Grid */}
            <div className="dashboard-grid">
                {/* Recent Leads */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>Recent Leads</h3>
                        <button className="card-link" onClick={() => onNavigate('leads')}>
                            View All →
                        </button>
                    </div>
                    <div className="card-body">
                        {recentLeads.length === 0 && (
                            <p className="empty-text">No leads yet. Submit one via the Capture tab.</p>
                        )}
                        {recentLeads.map((lead) => (
                            <div key={lead.id} className="lead-row">
                                <div className="lead-avatar">
                                    {lead.name.split(' ').map((n) => n[0]).join('')}
                                </div>
                                <div className="lead-info">
                                    <span className="lead-name">{lead.name}</span>
                                    <span className="lead-email">{lead.email}</span>
                                </div>
                                <span className={`lead-badge ${lead.status === 'QUALIFIED' ? 'qualified' : 'not-qualified'}`}>
                                    {lead.status === 'QUALIFIED' ? '✓' : '✗'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Executions */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>Recent Executions</h3>
                        <button className="card-link" onClick={() => onNavigate('executions')}>
                            View All →
                        </button>
                    </div>
                    <div className="card-body">
                        {recentExecs.length === 0 && (
                            <p className="empty-text">No executions yet.</p>
                        )}
                        {recentExecs.map((exec) => (
                            <div key={exec.id} className="exec-row">
                                <div className={`exec-dot ${exec.status}`} />
                                <div className="exec-info">
                                    <span className="exec-id">#{exec.id}</span>
                                    <span className="exec-lead">{exec.leadName}</span>
                                </div>
                                <span className="exec-duration">{formatDuration(exec.duration)}</span>
                                <span className="exec-time">{timeAgo(exec.startedAt)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Qualification Breakdown */}
            <div className="dashboard-card full-width">
                <div className="card-header">
                    <h3>Qualification Breakdown</h3>
                    <span className="card-subtitle">
                        {stats.qualificationRate}% qualification rate from {stats.totalLeads} lead{stats.totalLeads !== 1 ? 's' : ''}
                    </span>
                </div>
                <div className="card-body">
                    <div className="qual-bar-container">
                        <div
                            className="qual-bar qualified"
                            style={{
                                width: `${stats.totalLeads > 0 ? stats.qualificationRate : 0}%`,
                            }}
                        >
                            {stats.qualifiedCount > 0 && (
                                <span>{stats.qualifiedCount} Qualified</span>
                            )}
                        </div>
                        <div
                            className="qual-bar not-qualified"
                            style={{
                                width: `${stats.totalLeads > 0 ? 100 - stats.qualificationRate : 0}%`,
                            }}
                        >
                            {stats.notQualifiedCount > 0 && (
                                <span>{stats.notQualifiedCount} Not Qualified</span>
                            )}
                        </div>
                    </div>
                    {stats.totalLeads === 0 && (
                        <p className="empty-text" style={{ textAlign: 'center', marginTop: 12 }}>
                            No leads processed yet. Data will appear after the first workflow execution.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DashboardOverview
