/**
 * Utility functions only — no mock data.
 * All dashboard data comes from the live n8n API via DataContext.
 */

export const formatDateTime = (dateStr) => {
    if (!dateStr) return '—'
    try {
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })
    } catch {
        return dateStr
    }
}

export const timeAgo = (dateStr) => {
    if (!dateStr) return '—'
    try {
        const diff = Date.now() - new Date(dateStr).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 1) return 'just now'
        if (mins < 60) return `${mins}m ago`
        const hrs = Math.floor(mins / 60)
        if (hrs < 24) return `${hrs}h ago`
        const days = Math.floor(hrs / 24)
        return `${days}d ago`
    } catch {
        return dateStr
    }
}

export const formatDuration = (ms) => {
    if (!ms || ms <= 0) return '0ms'
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
}
