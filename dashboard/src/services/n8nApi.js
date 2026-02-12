/**
 * n8n API Service — fetches live data through the Vite proxy
 * All calls go to /n8n-api/* which the proxy forwards to your n8n instance
 * with the API key injected server-side.
 */

const WORKFLOW_ID = import.meta.env.VITE_WORKFLOW_ID || 'z7hftIHKkaxIDHKMCflwE'
const WEBHOOK_PATH = import.meta.env.VITE_WEBHOOK_PATH || 'ai-lead-capture'

// ──────────────────────────────── Fetch Workflow ────────────────────────────────

export async function fetchWorkflow() {
    const res = await fetch(`/n8n-api/workflows/${WORKFLOW_ID}`)
    if (!res.ok) throw new Error(`Failed to fetch workflow: ${res.status} ${res.statusText}`)
    return res.json()
}

// ──────────────────────────────── Fetch Executions ────────────────────────────────

export async function fetchExecutions(limit = 50) {
    const res = await fetch(
        `/n8n-api/executions?workflowId=${WORKFLOW_ID}&includeData=true&limit=${limit}`
    )
    if (!res.ok) throw new Error(`Failed to fetch executions: ${res.status} ${res.statusText}`)
    return res.json()
}

// ──────────────────────────────── Submit Lead via Webhook ────────────────────────────────

export async function submitLead({ name, email, phone, message }) {
    const res = await fetch(`/n8n-webhook/${WEBHOOK_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
    })
    // Webhook might return 200 with data or just a status
    const text = await res.text()
    try {
        return { ok: res.ok, status: res.status, data: JSON.parse(text) }
    } catch {
        return { ok: res.ok, status: res.status, data: text }
    }
}

// ──────────────────────────────── Parse Leads From Executions ────────────────────────────────

export function parseLeadsFromExecutions(executions) {
    if (!Array.isArray(executions)) return []

    return executions
        .map((exec) => {
            try {
                const runData = exec.data?.resultData?.runData
                if (!runData) return null

                // 1. Get lead info from Webhook node
                const webhookData = runData['Webhook']?.[0]?.data?.main?.[0]?.[0]?.json
                const body = webhookData?.body || {}

                // If no body data, skip this execution
                if (!body.name && !body.email) return null

                // 2. Get AI qualification result
                const aiData = runData['AI Qualification']?.[0]?.data?.main?.[0]?.[0]?.json
                // Handle both simplified (message.content) and full (choices[0].message.content) output formats
                const aiContent = aiData?.message?.content || aiData?.choices?.[0]?.message?.content || ''
                const tokensUsed = aiData?.usage?.total_tokens || 0

                // 3. Parse STATUS and REASON from AI response
                const statusMatch = aiContent.match(/STATUS:\s*(QUALIFIED|NOT_QUALIFIED)/i)
                const reasonMatch = aiContent.match(/REASON:\s*(.*)/is)

                const status = statusMatch ? statusMatch[1].toUpperCase() : 'UNKNOWN'
                const reason = reasonMatch ? reasonMatch[1].trim() : aiContent

                // 4. Check which path was taken
                const wasQualified = !!runData['Append row in sheet']
                const wasNotQualified = !!runData['Not Qualified Response']

                // 5. Compute duration
                const startedAt = new Date(exec.startedAt).getTime()
                const stoppedAt = new Date(exec.stoppedAt).getTime()
                const duration = stoppedAt - startedAt

                return {
                    id: exec.id,
                    name: body.name || 'Unknown',
                    email: body.email || '',
                    phone: body.phone || '',
                    service: body.service || '',
                    message: body.message || '',
                    source: body.source || 'direct',
                    status: status !== 'UNKNOWN' ? status : wasQualified ? 'QUALIFIED' : 'NOT_QUALIFIED',
                    reason,
                    timestamp: exec.startedAt,
                    executionId: exec.id,
                    tokensUsed,
                    duration,
                    executionStatus: exec.status,
                    mode: exec.mode,
                    wasQualified,
                }
            } catch (err) {
                console.warn(`Failed to parse execution ${exec.id}:`, err)
                return null
            }
        })
        .filter(Boolean)
}

// ──────────────────────────────── Parse Execution Metadata ────────────────────────────────

export function parseExecutionsMeta(executions) {
    if (!Array.isArray(executions)) return []

    return executions.map((exec) => {
        const runData = exec.data?.resultData?.runData
        const webhookData = runData?.['Webhook']?.[0]?.data?.main?.[0]?.[0]?.json
        const body = webhookData?.body || {}

        const aiData = runData?.['AI Qualification']?.[0]?.data?.main?.[0]?.[0]?.json
        // Handle both simplified (message.content) and full (choices[0].message.content) output formats
        const aiContent = aiData?.message?.content || aiData?.choices?.[0]?.message?.content || ''
        const tokensUsed = aiData?.usage?.total_tokens || 0

        const statusMatch = aiContent.match(/STATUS:\s*(QUALIFIED|NOT_QUALIFIED)/i)
        const qualification = statusMatch ? statusMatch[1].toUpperCase() : 'UNKNOWN'

        const startedAt = new Date(exec.startedAt).getTime()
        const stoppedAt = new Date(exec.stoppedAt).getTime()
        const duration = stoppedAt - startedAt

        let error = null
        if (exec.status === 'error') {
            error = exec.data?.resultData?.error?.message || 'Unknown error'
        }

        return {
            id: exec.id,
            status: exec.status || 'unknown',
            mode: exec.mode || 'unknown',
            startedAt: exec.startedAt,
            stoppedAt: exec.stoppedAt,
            duration: isNaN(duration) ? 0 : duration,
            leadName: body.name || 'Unknown',
            leadEmail: body.email || '',
            qualification,
            tokensUsed,
            error,
            lastNodeExecuted: exec.data?.resultData?.lastNodeExecuted || '',
        }
    })
}

// ──────────────────────────────── Extract Workflow Metadata ────────────────────────────────

export function parseWorkflowInfo(workflow) {
    if (!workflow) return null

    const nodes = (workflow.nodes || []).map((n) => ({
        id: n.id,
        name: n.name,
        type: n.type,
        icon: getNodeIcon(n.type),
    }))

    const connections = []
    for (const [fromNode, outputs] of Object.entries(workflow.connections || {})) {
        const mainOutputs = outputs.main || []
        mainOutputs.forEach((outputConnections, outputIndex) => {
            (outputConnections || []).forEach((conn) => {
                connections.push({
                    from: fromNode,
                    to: conn.node,
                    label:
                        fromNode === 'Is Qualified?'
                            ? outputIndex === 0
                                ? 'Qualified'
                                : 'Not Qualified'
                            : undefined,
                })
            })
        })
    }

    return {
        id: workflow.id,
        name: workflow.name,
        active: workflow.active,
        createdAt: workflow.createdAt,
        updatedAt: workflow.updatedAt,
        nodes,
        connections,
        nodeCount: nodes.length,
        rawNodes: workflow.nodes || [],
    }
}

function getNodeIcon(type) {
    const icons = {
        'n8n-nodes-base.webhook': '🌐',
        'n8n-nodes-base.openAi': '🤖',
        'n8n-nodes-base.if': '🔀',
        'n8n-nodes-base.googleSheets': '📊',
        'n8n-nodes-base.respondToWebhook': '📨',
    }
    return icons[type] || '⚙️'
}
