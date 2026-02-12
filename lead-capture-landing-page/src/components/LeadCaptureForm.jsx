import { useState } from 'react'
import { serviceOptions } from '../data/businessData'
import './LeadCaptureForm.css'

const WEBHOOK_PATH = import.meta.env.VITE_WEBHOOK_PATH || 'ai-lead-capture'

function LeadCaptureForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
    })
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [resultData, setResultData] = useState(null)
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                service: formData.service,
                message: formData.message || `Interested in ${formData.service}`,
                source: 'saikumar-ai-landing-page',
                submittedAt: new Date().toISOString(),
            }

            const res = await fetch(`/n8n-webhook/${WEBHOOK_PATH}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error('Submission failed')

            let data = null
            try {
                const text = await res.text()
                data = JSON.parse(text)
            } catch {
                // Ignore parse errors
            }

            setResultData(data)
            setSubmitted(true)
            setFormData({ name: '', email: '', phone: '', service: '', message: '' })
        } catch (err) {
            setError('Something went wrong. Please try again or reach out on LinkedIn.')
        } finally {
            setSubmitting(false)
        }
    }

    if (submitted) {
        return (
            <section id="contact" className="section form-section bg-dark">
                <div className="container">
                    <div className="success-wrapper animate-in">
                        <div className="success-card glass">
                            <div className="success-icon">🚀</div>
                            <h2>Inbound Request Received!</h2>
                            <p>
                                Thank you for your interest in <strong>Saikumar.ai</strong>. Our automation specialist
                                will review your business requirements and contact you within
                                <strong> 4 business hours</strong> to schedule your free strategy call.
                            </p>
                            <button
                                className="btn btn-primary"
                                onClick={() => setSubmitted(false)}
                            >
                                Submit Another Inquiry
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section id="contact" className="section form-section">
            <div className="container">
                <div className="form-layout">
                    {/* Left: Persuasion */}
                    <div className="form-info">
                        <span className="section-label">⚡ Future-Proof Your Business</span>
                        <h2 className="section-title">
                            Ready to <span className="highlight">Automate</span> Your Growth?
                        </h2>
                        <p className="section-subtitle">
                            Schedule a free 20-minute strategy call to discover how AI agents
                            and automated workflows can save you hundreds of hours every month.
                        </p>

                        <div className="form-perks">
                            <div className="perk">
                                <span className="perk-icon">🎯</span>
                                <div className="perk-text">
                                    <strong>Personalized AI Audit</strong>
                                    <span>We'll identify the best automation opportunities for your specific niche.</span>
                                </div>
                            </div>
                            <div className="perk">
                                <span className="perk-icon">⚙️</span>
                                <div className="perk-text">
                                    <strong>No-Code & Custom Solutions</strong>
                                    <span>From simple n8n workflows to complex custom AI agents.</span>
                                </div>
                            </div>
                            <div className="perk">
                                <span className="perk-icon">�</span>
                                <div className="perk-text">
                                    <strong>ROI-Focused Approach</strong>
                                    <span>We only build solutions that either save money or generate revenue.</span>
                                </div>
                            </div>
                        </div>

                        <div className="form-trust">
                            <div className="trust-avatar-group">
                                <div className="trust-avatar">AR</div>
                                <div className="trust-avatar">PS</div>
                                <div className="trust-avatar">MC</div>
                            </div>
                            <span className="trust-text">Join 50+ businesses scaling with our AI solutions.</span>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="form-card glass">
                        <div className="form-card-header">
                            <h3>📅 Schedule Your Free Call</h3>
                            <p>Enter your details below to get started</p>
                        </div>

                        <form onSubmit={handleSubmit} className="capture-form">
                            <div className="form-group">
                                <label htmlFor="lp-name">Full Name</label>
                                <input
                                    id="lp-name"
                                    type="text"
                                    name="name"
                                    placeholder="e.g. John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="lp-email">Business Email</label>
                                    <input
                                        id="lp-email"
                                        type="email"
                                        name="email"
                                        placeholder="john@company.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={submitting}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lp-phone">Phone Number</label>
                                    <input
                                        id="lp-phone"
                                        type="tel"
                                        name="phone"
                                        placeholder="+91 83410..."
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="lp-service">What can we help you automate?</label>
                                <select
                                    id="lp-service"
                                    name="service"
                                    value={formData.service}
                                    onChange={handleChange}
                                    required
                                    disabled={submitting}
                                >
                                    <option value="">Select a service focus...</option>
                                    {serviceOptions.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="lp-message">About Your Business</label>
                                <textarea
                                    id="lp-message"
                                    name="message"
                                    placeholder="Briefly describe your current manual processes or AI goals..."
                                    rows={3}
                                    value={formData.message}
                                    onChange={handleChange}
                                    disabled={submitting}
                                />
                            </div>

                            {error && <div className="form-error">{error}</div>}

                            <button
                                type="submit"
                                className="btn btn-primary submit-btn"
                                disabled={
                                    submitting ||
                                    !formData.name ||
                                    !formData.email ||
                                    !formData.phone ||
                                    !formData.service
                                }
                            >
                                {submitting ? (
                                    <>
                                        <span className="btn-spinner" />
                                        Scheduling...
                                    </>
                                ) : (
                                    <>Schedule Your Free Call</>
                                )}
                            </button>

                            <p className="form-disclaimer">
                                🔒 Your data is kept private and secure.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LeadCaptureForm
