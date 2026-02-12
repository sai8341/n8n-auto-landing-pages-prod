import { useState } from 'react'
import { useData } from '../context/DataContext'
import { formatDateTime, formatDuration, timeAgo } from '../data/mockData'
import './ExecutionHistory.css'

function ExecutionHistory() {
    const { executions, stats } = useData()
    const [statusFilter, setStatusFilter] = useState('all')
    const [expandedId, setExpandedId] = useState(null)

    const filtered = executions.filter((e) => {
        return statusFilter === 'all' || e.status === statusFilter
    })

    return (
        <div className="executions-page animate-in">
            {/* Stats Row */}
            <div className="exec-stats-row">
                <div className="exec-stat-card">
                    <span className="exec-stat-icon">⚡</span>
                    <div className="exec-stat-body">
                        <span className="exec-stat-val">{stats.totalExecutions}</span>
                        <span className="exec-stat-lbl">Total Runs</span>
                    </div>
                </div>
                <div className="exec-stat-card success">
                    <span className="exec-stat-icon">✅</span>
                    <div className="exec-stat-body">
                        <span className="exec-stat-val">{stats.successCount}</span>
                        <span className="exec-stat-lbl">Successful</span>
                    </div>
                </div>
                <div className="exec-stat-card error">
                    <span className="exec-stat-icon">❌</span>
                    <div className="exec-stat-body">
                        <span className="exec-stat-val">{stats.errorCount}</span>
                        <span className="exec-stat-lbl">Failed</span>
                    </div>
                </div>
                <div className="exec-stat-card">
                    <span className="exec-stat-icon">⏱️</span>
                    <div className="exec-stat-body">
                        <span className="exec-stat-val">{formatDuration(stats.avgDuration)}</span>
                        <span className="exec-stat-lbl">Avg Duration</span>
                    </div>
                </div>
                <div className="exec-stat-card">
                    <span className="exec-stat-icon">🧠</span>
                    <div className="exec-stat-body">
                        <span className="exec-stat-val">{stats.totalTokens.toLocaleString()}</span>
                        <span className="exec-stat-lbl">Total Tokens</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="exec-toolbar">
                <div className="filter-group">
                    <button
                        className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('all')}
                    >
                        All ({stats.totalExecutions})
                    </button>
                    <button
                        className={`filter-btn qualified ${statusFilter === 'success' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('success')}
                    >
                        ✓ Success ({stats.successCount})
                    </button>
                    <button
                        className={`filter-btn not-qualified ${statusFilter === 'error' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('error')}
                    >
                        ✗ Failed ({stats.errorCount})
                    </button>
                </div>
            </div>

            {/* Execution Cards */}
            <div className="exec-timeline">
                {filtered.length === 0 && (
                    <div className="empty-state">
                        <span className="empty-icon">⚡</span>
                        <h3>No executions found</h3>
                        <p>
                            {executions.length === 0
                                ? 'No workflow executions yet. Submit a lead to trigger the first one.'
                                : 'No executions match the current filter.'}
                        </p>
                    </div>
                )}

                {filtered.map((exec, i) => (
                    <div
                        key={exec.id}
                        className={`exec-card animate-in stagger-${Math.min(i + 1, 5)} ${exec.status}`}
                    >
                        <div
                            className="exec-card-header"
                            onClick={() => setExpandedId(expandedId === exec.id ? null : exec.id)}
                        >
                            <div className="exec-card-left">
                                <div className={`exec-card-dot ${exec.status}`}>
                                    {exec.status === 'success' ? '✓' : '✗'}
                                </div>
                                <div className="exec-card-info">
                                    <div className="exec-card-title">
                                        <span className="exec-card-id">#{exec.id}</span>
                                        <span className={`exec-card-status ${exec.status}`}>{exec.status}</span>
                                        <span className={`exec-card-mode ${exec.mode}`}>{exec.mode}</span>
                                    </div>
                                    <span className="exec-card-lead">
                                        {exec.leadName} ({exec.leadEmail})
                                    </span>
                                </div>
                            </div>
                            <div className="exec-card-right">
                                <div className="exec-card-metrics">
                                    <span className="metric">
                                        <span className="metric-label">Duration</span>
                                        <span className="metric-value">{formatDuration(exec.duration)}</span>
                                    </span>
                                    <span className="metric">
                                        <span className="metric-label">Tokens</span>
                                        <span className="metric-value">{exec.tokensUsed}</span>
                                    </span>
                                    <span className="metric">
                                        <span className="metric-label">Result</span>
                                        <span
                                            className={`metric-value ${exec.qualification === 'QUALIFIED' ? 'qual' : 'not-qual'}`}
                                        >
                                            {exec.qualification}
                                        </span>
                                    </span>
                                </div>
                                <span className="exec-card-time">{timeAgo(exec.startedAt)}</span>
                                <button className="expand-btn">
                                    {expandedId === exec.id ? '▲' : '▼'}
                                </button>
                            </div>
                        </div>

                        {expandedId === exec.id && (
                            <div className="exec-card-detail">
                                <div className="exec-detail-grid">
                                    <div className="exec-detail-item">
                                        <span className="detail-label">Started At</span>
                                        <span className="detail-value">{formatDateTime(exec.startedAt)}</span>
                                    </div>
                                    <div className="exec-detail-item">
                                        <span className="detail-label">Ended At</span>
                                        <span className="detail-value">{formatDateTime(exec.stoppedAt)}</span>
                                    </div>
                                    <div className="exec-detail-item">
                                        <span className="detail-label">Duration</span>
                                        <span className="detail-value">{formatDuration(exec.duration)}</span>
                                    </div>
                                    <div className="exec-detail-item">
                                        <span className="detail-label">Mode</span>
                                        <span className="detail-value">{exec.mode}</span>
                                    </div>
                                    <div className="exec-detail-item">
                                        <span className="detail-label">AI Model</span>
                                        <span className="detail-value">gpt-4o-mini</span>
                                    </div>
                                    <div className="exec-detail-item">
                                        <span className="detail-label">Tokens Used</span>
                                        <span className="detail-value">{exec.tokensUsed}</span>
                                    </div>
                                </div>
                                {exec.error && (
                                    <div className="exec-error-box">
                                        <span className="error-title">❌ Error</span>
                                        <span className="error-message">{exec.error}</span>
                                    </div>
                                )}
                                <div className="exec-node-timeline">
                                    <h4>Node Execution Path</h4>
                                    <div className="node-path">
                                        <span className="path-node">🌐 Webhook</span>
                                        <span className="path-arrow">→</span>
                                        <span className="path-node">🤖 AI Qualification</span>
                                        <span className="path-arrow">→</span>
                                        <span className="path-node">🔀 Is Qualified?</span>
                                        <span className="path-arrow">→</span>
                                        {exec.qualification === 'QUALIFIED' ? (
                                            <>
                                                <span className="path-node success">📊 Append to Sheet</span>
                                                <span className="path-arrow">→</span>
                                                <span className="path-node success">✅ Qualified Response</span>
                                            </>
                                        ) : (
                                            <span className="path-node error">❌ Not Qualified Response</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ExecutionHistory
