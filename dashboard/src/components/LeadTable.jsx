import { useState } from 'react'
import { useData } from '../context/DataContext'
import { formatDateTime, timeAgo } from '../data/mockData'
import './LeadTable.css'

function LeadTable() {
    const { leads, stats } = useData()
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [expandedId, setExpandedId] = useState(null)

    const filtered = leads.filter((l) => {
        const matchesFilter = filter === 'all' || l.status === filter
        const matchesSearch =
            !search ||
            l.name.toLowerCase().includes(search.toLowerCase()) ||
            l.email.toLowerCase().includes(search.toLowerCase()) ||
            (l.phone && l.phone.toLowerCase().includes(search.toLowerCase())) ||
            l.message.toLowerCase().includes(search.toLowerCase())
        return matchesFilter && matchesSearch
    })

    return (
        <div className="leads-page animate-in">
            {/* Summary */}
            <div className="leads-summary">
                <div className="summary-item">
                    <span className="summary-count">{stats.totalLeads}</span>
                    <span className="summary-label">Total Leads</span>
                </div>
                <div className="summary-item qualified">
                    <span className="summary-count">{stats.qualifiedCount}</span>
                    <span className="summary-label">Qualified</span>
                </div>
                <div className="summary-item not-qualified">
                    <span className="summary-count">{stats.notQualifiedCount}</span>
                    <span className="summary-label">Not Qualified</span>
                </div>
            </div>

            {/* Filters */}
            <div className="leads-toolbar">
                <div className="filter-group">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({stats.totalLeads})
                    </button>
                    <button
                        className={`filter-btn qualified ${filter === 'QUALIFIED' ? 'active' : ''}`}
                        onClick={() => setFilter('QUALIFIED')}
                    >
                        ✓ Qualified ({stats.qualifiedCount})
                    </button>
                    <button
                        className={`filter-btn not-qualified ${filter === 'NOT_QUALIFIED' ? 'active' : ''}`}
                        onClick={() => setFilter('NOT_QUALIFIED')}
                    >
                        ✗ Not Qualified ({stats.notQualifiedCount})
                    </button>
                </div>
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search leads..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="leads-table-container">
                <table className="leads-table">
                    <thead>
                        <tr>
                            <th>Lead</th>
                            <th>Message</th>
                            <th>Status</th>
                            <th>Time</th>
                            <th>Exec ID</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((lead) => (
                            <>
                                <tr key={lead.id} className={`table-row ${expandedId === lead.id ? 'expanded' : ''}`}>
                                    <td>
                                        <div className="table-lead">
                                            <div className="table-avatar">
                                                {lead.name.split(' ').map((n) => n[0]).join('')}
                                            </div>
                                            <div className="table-lead-info">
                                                <span className="table-name">{lead.name}</span>
                                                <div className="table-meta-compact">
                                                    <span className="table-email">{lead.email}</span>
                                                    {lead.phone && <span className="table-phone">• {lead.phone}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="table-message">{lead.message}</span>
                                    </td>
                                    <td>
                                        <span className={`table-status ${lead.status === 'QUALIFIED' ? 'qualified' : 'not-qualified'}`}>
                                            {lead.status === 'QUALIFIED' ? '✓ Qualified' : '✗ Not Qualified'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="table-time">{timeAgo(lead.timestamp)}</span>
                                    </td>
                                    <td>
                                        <span className="table-exec-id">#{lead.executionId}</span>
                                    </td>
                                    <td>
                                        <button
                                            className="expand-btn"
                                            onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                                        >
                                            {expandedId === lead.id ? '▲' : '▼'}
                                        </button>
                                    </td>
                                </tr>
                                {expandedId === lead.id && (
                                    <tr key={`${lead.id}-detail`} className="detail-row">
                                        <td colSpan={6}>
                                            <div className="detail-content">
                                                <div className="detail-section">
                                                    <h4>🤖 AI Reasoning</h4>
                                                    <p>{lead.reason || 'No reasoning available'}</p>
                                                </div>
                                                <div className="detail-section">
                                                    <h4>📝 Full Message</h4>
                                                    <p>{lead.message}</p>
                                                </div>
                                                <div className="detail-meta">
                                                    <span>📅 {formatDateTime(lead.timestamp)}</span>
                                                    <span>📧 {lead.email}</span>
                                                    {lead.phone && <span>📞 {lead.phone}</span>}
                                                    <span>⚡ Execution #{lead.executionId}</span>
                                                    <span>🧠 {lead.tokensUsed} tokens</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div className="empty-state">
                        <span className="empty-icon">🔍</span>
                        <h3>No leads found</h3>
                        <p>
                            {leads.length === 0
                                ? 'No leads have been processed yet. Submit one via the Capture tab.'
                                : 'Try adjusting your filters or search query.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LeadTable
