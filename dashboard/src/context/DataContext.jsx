import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import {
    fetchWorkflow,
    fetchExecutions,
    parseLeadsFromExecutions,
    parseExecutionsMeta,
    parseWorkflowInfo,
} from '../services/n8nApi'

const DataContext = createContext(null)
const REFRESH_INTERVAL = 30000 // 30 seconds

export function DataProvider({ children }) {
    const [rawWorkflow, setRawWorkflow] = useState(null)
    const [rawExecutions, setRawExecutions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [lastRefresh, setLastRefresh] = useState(null)

    const loadData = useCallback(async () => {
        try {
            setError(null)

            const [wfRes, execRes] = await Promise.all([
                fetchWorkflow(),
                fetchExecutions(100),
            ])

            setRawWorkflow(wfRes)
            setRawExecutions(execRes.data || [])
            setLastRefresh(new Date())
        } catch (err) {
            setError(err.message)
            console.error('Failed to load n8n data:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadData()
        const interval = setInterval(loadData, REFRESH_INTERVAL)
        return () => clearInterval(interval)
    }, [loadData])

    // ── Derived data ────────────────────────────────────────
    const workflow = useMemo(() => parseWorkflowInfo(rawWorkflow), [rawWorkflow])
    const leads = useMemo(() => parseLeadsFromExecutions(rawExecutions), [rawExecutions])
    const executions = useMemo(() => parseExecutionsMeta(rawExecutions), [rawExecutions])

    // ── Computed stats ────────────────────────────────────────
    const stats = useMemo(() => {
        const totalLeads = leads.length
        const qualifiedCount = leads.filter((l) => l.status === 'QUALIFIED').length
        const notQualifiedCount = leads.filter((l) => l.status === 'NOT_QUALIFIED').length
        const qualificationRate = totalLeads > 0 ? Math.round((qualifiedCount / totalLeads) * 100) : 0

        const totalExecutions = executions.length
        const successCount = executions.filter((e) => e.status === 'success').length
        const errorCount = executions.filter((e) => e.status === 'error').length

        const durations = executions.filter((e) => e.duration > 0).map((e) => e.duration)
        const avgDuration = durations.length > 0
            ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
            : 0

        const totalTokens = leads.reduce((sum, l) => sum + (l.tokensUsed || 0), 0)

        return {
            totalLeads,
            qualifiedCount,
            notQualifiedCount,
            qualificationRate,
            totalExecutions,
            successCount,
            errorCount,
            avgDuration,
            totalTokens,
        }
    }, [leads, executions])

    const value = useMemo(
        () => ({
            workflow,
            leads,
            executions,
            stats,
            loading,
            error,
            lastRefresh,
            refresh: loadData,
        }),
        [workflow, leads, executions, stats, loading, error, lastRefresh, loadData]
    )

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
    const ctx = useContext(DataContext)
    if (!ctx) throw new Error('useData must be used within <DataProvider>')
    return ctx
}
