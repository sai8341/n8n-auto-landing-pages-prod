import { useState } from 'react'
import { useData } from '../context/DataContext'
import { submitLead } from '../services/n8nApi'
import './LeadForm.css'

const WEBHOOK_PATH = import.meta.env.VITE_WEBHOOK_PATH || 'ai-lead-capture'

function LeadForm() {
    const { workflow, refresh } = useData()
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
    const [submitting, setSubmitting] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [activeStep, setActiveStep] = useState(-1)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setResult(null)
        setError(null)
        setActiveStep(0)

        try {
            // Step 1: Webhook receives
            await delay(500)
            setActiveStep(1)

            // Step 2: AI Qualification (real call happens here)
            const response = await submitLead(formData)
            setActiveStep(2)

            await delay(300)
            setActiveStep(3)

            if (response.ok) {
                // Parse the webhook response to extract qualification result
                const data = response.data
                let status = 'UNKNOWN'
                let reason = ''

                if (typeof data === 'object') {
                    // Try to extract status from response
                    const content = JSON.stringify(data)
                    const statusMatch = content.match(/STATUS:\s*(QUALIFIED|NOT_QUALIFIED)/i)
                    const reasonMatch = content.match(/REASON:\s*(.*?)(?:"|$)/is)
                    status = statusMatch ? statusMatch[1].toUpperCase() : 'PROCESSED'
                    reason = reasonMatch ? reasonMatch[1].trim() : 'See execution details in n8n.'
                } else if (typeof data === 'string') {
                    const statusMatch = data.match(/STATUS:\s*(QUALIFIED|NOT_QUALIFIED)/i)
                    const reasonMatch = data.match(/REASON:\s*(.*)/is)
                    status = statusMatch ? statusMatch[1].toUpperCase() : 'PROCESSED'
                    reason = reasonMatch ? reasonMatch[1].trim() : data
                }

                setResult({ status, reason, raw: data })
                setActiveStep(4)

                // Refresh dashboard data to pick up the new execution
                setTimeout(() => refresh(), 2000)
            } else {
                throw new Error(`Webhook returned ${response.status}`)
            }
        } catch (err) {
            setError(err.message || 'Failed to submit lead. Is the workflow active?')
            setActiveStep(-1)
        } finally {
            setSubmitting(false)
        }
    }

    const pipelineSteps = [
        { icon: '🌐', label: 'Webhook Received', desc: 'POST data sent to n8n' },
        { icon: '🤖', label: 'AI Qualification', desc: 'GPT-4o mini analyzing lead' },
        { icon: '🔀', label: 'Route Decision', desc: 'Qualified or Not?' },
        { icon: '📊', label: 'Store / Respond', desc: 'Save result & send response' },
        { icon: '✅', label: 'Complete', desc: 'Lead processed' },
    ]

    return (
        <div className="lead-form-page animate-in">
            <div className="form-container">
                {/* Form Section */}
                <div className="form-section">
                    <div className="form-header">
                        <h2>🎯 Capture New Lead</h2>
                        <p>
                            Submit a lead to the <strong>live n8n workflow</strong>. The AI will
                            analyze and qualify in real-time.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="capture-form">
                        <div className="form-group">
                            <label htmlFor="lead-name">Full Name</label>
                            <input
                                id="lead-name"
                                type="text"
                                name="name"
                                placeholder="e.g. Sarah Johnson"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lead-email">Email Address</label>
                            <input
                                id="lead-email"
                                type="email"
                                name="email"
                                placeholder="e.g. sarah@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lead-phone">Phone Number</label>
                            <input
                                id="lead-phone"
                                type="tel"
                                name="phone"
                                placeholder="e.g. +1 (555) 000-0000"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lead-message">Message / Inquiry</label>
                            <textarea
                                id="lead-message"
                                name="message"
                                placeholder="Describe what you're looking for..."
                                rows={4}
                                value={formData.message}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                            />
                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={submitting || !formData.name || !formData.email || !formData.phone || !formData.message}
                        >
                            {submitting ? (
                                <>
                                    <span className="btn-spinner" /> Processing...
                                </>
                            ) : (
                                '🚀 Submit to Live Workflow'
                            )}
                        </button>

                        {!workflow?.active && (
                            <div className="workflow-warning">
                                ⚠️ Workflow is currently <strong>inactive</strong>. Activate it in n8n
                                for submissions to work.
                            </div>
                        )}
                    </form>
                </div>

                {/* Info Section */}
                <div className="info-section">
                    {/* Webhook info */}
                    <div className="webhook-info">
                        <h3>🔗 Live Webhook Endpoint</h3>
                        <div className="webhook-url">
                            <span className="method-badge">POST</span>
                            <code>/webhook/{WEBHOOK_PATH}</code>
                        </div>
                        <div className="payload-preview">
                            <h4>Request Payload</h4>
                            <pre>
                                {JSON.stringify(
                                    {
                                        name: formData.name || '"..."',
                                        email: formData.email || '"..."',
                                        phone: formData.phone || '"..."',
                                        message: formData.message || '"..."',
                                    },
                                    null,
                                    2
                                )}
                            </pre>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="result-card error">
                            <div className="result-header">
                                <span className="result-icon">❌</span>
                                <span className="result-title">Submission Failed</span>
                            </div>
                            <p className="result-reason">{error}</p>
                        </div>
                    )}

                    {/* Result */}
                    {result && (
                        <div
                            className={`result-card ${result.status === 'QUALIFIED'
                                ? 'qualified'
                                : result.status === 'NOT_QUALIFIED'
                                    ? 'not-qualified'
                                    : 'processed'
                                }`}
                        >
                            <div className="result-header">
                                <span className="result-icon">
                                    {result.status === 'QUALIFIED' ? '✅' : result.status === 'NOT_QUALIFIED' ? '❌' : '📋'}
                                </span>
                                <span className="result-title">
                                    {result.status === 'QUALIFIED'
                                        ? 'Lead Qualified!'
                                        : result.status === 'NOT_QUALIFIED'
                                            ? 'Not Qualified'
                                            : 'Lead Processed'}
                                </span>
                            </div>
                            <p className="result-reason">{result.reason}</p>
                            {result.raw && typeof result.raw === 'object' && (
                                <details className="result-raw">
                                    <summary>Raw Response</summary>
                                    <pre>{JSON.stringify(result.raw, null, 2)}</pre>
                                </details>
                            )}
                        </div>
                    )}

                    {/* Pipeline Steps */}
                    <div className="pipeline-section">
                        <h3>⚡ Execution Pipeline</h3>
                        <div className="pipeline-steps">
                            {pipelineSteps.map((step, i) => (
                                <div
                                    key={i}
                                    className={`pipeline-step ${i < activeStep
                                        ? 'done'
                                        : i === activeStep
                                            ? 'active'
                                            : ''
                                        }`}
                                >
                                    <span className="step-icon">{step.icon}</span>
                                    <div className="step-info">
                                        <span className="step-label">{step.label}</span>
                                        <span className="step-desc">{step.desc}</span>
                                    </div>
                                    {i < activeStep && <span className="step-check">✓</span>}
                                    {i === activeStep && submitting && <span className="step-spinner" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function delay(ms) {
    return new Promise((r) => setTimeout(r, ms))
}

export default LeadForm
