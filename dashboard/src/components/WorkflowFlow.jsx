import { useState } from 'react'
import { useData } from '../context/DataContext'
import { formatDateTime } from '../data/mockData'
import './WorkflowFlow.css'

function WorkflowFlow() {
    const { workflow } = useData()
    const [selectedNode, setSelectedNode] = useState(null)

    if (!workflow) {
        return (
            <div className="workflow-page animate-in">
                <div className="empty-state">
                    <span className="empty-icon">🔄</span>
                    <h3>Loading workflow...</h3>
                </div>
            </div>
        )
    }

    // Build node detail info from the real workflow data
    const rawNodes = workflow.rawNodes || []

    const getNodeDetail = (nodeName) => {
        const raw = rawNodes.find((n) => n.name === nodeName)
        if (!raw) return null

        return {
            name: raw.name,
            type: raw.type,
            typeVersion: raw.typeVersion,
            position: raw.position,
            parameters: raw.parameters || {},
        }
    }

    // Determine the node types from real data
    const nodeTypes = {}
    rawNodes.forEach((n) => {
        nodeTypes[n.name] = n.type
    })

    const getNodeCategory = (type) => {
        if (type?.includes('webhook')) return 'webhook'
        if (type?.includes('openAi') || type?.includes('lmChatOpenAi')) return 'ai'
        if (type?.includes('if')) return 'condition'
        if (type?.includes('googleSheets')) return 'sheets'
        if (type?.includes('respondToWebhook')) return 'response'
        return 'default'
    }

    const getNodeIcon = (type) => {
        const icons = {
            webhook: '🌐',
            ai: '🤖',
            condition: '🔀',
            sheets: '📊',
            response: '📨',
            default: '⚙️',
        }
        return icons[getNodeCategory(type)] || '⚙️'
    }

    return (
        <div className="workflow-page animate-in">
            {/* Workflow Info */}
            <div className="wf-info-bar">
                <div className="wf-info-left">
                    <h2>🔄 {workflow.name}</h2>
                    <div className="wf-meta-row">
                        <span className="wf-meta">
                            <span className={`wf-status-dot ${workflow.active ? 'active' : 'inactive'}`} />
                            {workflow.active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="wf-meta">
                            ID: <code>{workflow.id}</code>
                        </span>
                        <span className="wf-meta">Nodes: {workflow.nodeCount}</span>
                        <span className="wf-meta">Updated: {formatDateTime(workflow.updatedAt)}</span>
                    </div>
                </div>
            </div>

            <div className="wf-layout">
                {/* Flow Canvas */}
                <div className="wf-canvas">
                    <div className="flow-diagram">
                        {/* Row 1: Webhook → AI → IF */}
                        <div className="flow-row main-row">
                            {['Webhook', 'AI Qualification', 'Is Qualified?'].map((name, i) => {
                                const type = nodeTypes[name]
                                const cat = getNodeCategory(type)
                                return (
                                    <span key={name} style={{ display: 'contents' }}>
                                        {i > 0 && (
                                            <svg className="flow-connector" viewBox="0 0 60 10">
                                                <line x1="0" y1="5" x2="60" y2="5" className="connector-line" />
                                                <polygon points="55,2 60,5 55,8" className="connector-arrow" />
                                            </svg>
                                        )}
                                        <div
                                            className={`flow-node ${cat} ${selectedNode === name ? 'selected' : ''}`}
                                            onClick={() => setSelectedNode(selectedNode === name ? null : name)}
                                        >
                                            <span className="node-icon">{getNodeIcon(type)}</span>
                                            <span className="node-name">{name}</span>
                                            <span className="node-type">{type || 'Unknown'}</span>
                                        </div>
                                    </span>
                                )
                            })}
                        </div>

                        {/* Branches */}
                        <div className="branch-container">
                            {/* Qualified Branch */}
                            <div className="branch qualified-branch">
                                <div className="branch-label-row">
                                    <span className="branch-label qualified">✓ Qualified</span>
                                    <svg className="branch-connector" viewBox="0 0 100 10">
                                        <line x1="0" y1="5" x2="100" y2="5" className="connector-line qualified" />
                                        <polygon points="95,2 100,5 95,8" className="connector-arrow qualified" />
                                    </svg>
                                </div>
                                <div className="branch-nodes">
                                    {['Append row in sheet', 'Qualified Response'].map((name, i) => {
                                        const type = nodeTypes[name]
                                        const cat = getNodeCategory(type)
                                        return (
                                            <span key={name} style={{ display: 'contents' }}>
                                                {i > 0 && (
                                                    <svg className="flow-connector" viewBox="0 0 60 10">
                                                        <line x1="0" y1="5" x2="60" y2="5" className="connector-line qualified" />
                                                        <polygon points="55,2 60,5 55,8" className="connector-arrow qualified" />
                                                    </svg>
                                                )}
                                                <div
                                                    className={`flow-node ${cat} ${cat === 'response' ? 'qualified' : ''} ${selectedNode === name ? 'selected' : ''
                                                        }`}
                                                    onClick={() => setSelectedNode(selectedNode === name ? null : name)}
                                                >
                                                    <span className="node-icon">{getNodeIcon(type)}</span>
                                                    <span className="node-name">{name}</span>
                                                    <span className="node-type">{type || 'Unknown'}</span>
                                                </div>
                                            </span>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Not Qualified Branch */}
                            <div className="branch not-qualified-branch">
                                <div className="branch-label-row">
                                    <span className="branch-label not-qualified">✗ Not Qualified</span>
                                    <svg className="branch-connector" viewBox="0 0 100 10">
                                        <line x1="0" y1="5" x2="100" y2="5" className="connector-line error" />
                                        <polygon points="95,2 100,5 95,8" className="connector-arrow error" />
                                    </svg>
                                </div>
                                <div className="branch-nodes">
                                    <div
                                        className={`flow-node response not-qualified ${selectedNode === 'Not Qualified Response' ? 'selected' : ''
                                            }`}
                                        onClick={() =>
                                            setSelectedNode(
                                                selectedNode === 'Not Qualified Response' ? null : 'Not Qualified Response'
                                            )
                                        }
                                    >
                                        <span className="node-icon">❌</span>
                                        <span className="node-name">Not Qualified Response</span>
                                        <span className="node-type">
                                            {nodeTypes['Not Qualified Response'] || 'n8n-nodes-base.respondToWebhook'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Node Detail Panel */}
                {selectedNode && (
                    <div className="node-detail-panel animate-in">
                        <div className="panel-header">
                            <h3>
                                {getNodeIcon(nodeTypes[selectedNode])} {selectedNode}
                            </h3>
                            <button className="panel-close" onClick={() => setSelectedNode(null)}>
                                ✕
                            </button>
                        </div>
                        <div className="panel-body">
                            {(() => {
                                const detail = getNodeDetail(selectedNode)
                                if (!detail) {
                                    return <p style={{ color: 'var(--text-muted)' }}>Node data not found.</p>
                                }
                                return (
                                    <>
                                        <div className="panel-section">
                                            <h4>Node Type</h4>
                                            <code className="panel-code">{detail.type}</code>
                                        </div>
                                        <div className="panel-section">
                                            <h4>Version</h4>
                                            <span className="detail-value">v{detail.typeVersion}</span>
                                        </div>
                                        {detail.position && (
                                            <div className="panel-section">
                                                <h4>Canvas Position</h4>
                                                <span className="detail-value">
                                                    x: {detail.position[0]}, y: {detail.position[1]}
                                                </span>
                                            </div>
                                        )}
                                        <div className="panel-section">
                                            <h4>Parameters</h4>
                                            <pre className="panel-config">
                                                {JSON.stringify(detail.parameters, null, 2)}
                                            </pre>
                                        </div>
                                    </>
                                )
                            })()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WorkflowFlow
