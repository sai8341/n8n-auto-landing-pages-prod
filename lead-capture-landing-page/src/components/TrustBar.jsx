import './TrustBar.css'

function TrustBar() {
    const trusted = [
        { icon: '🛡️', label: 'SOC2 Compliant' },
        { icon: '🏅', label: 'AI Excellence 2025' },
        { icon: '✅', label: 'API-First Architecture' },
        { icon: '⭐', label: '4.9/5 Client Rating' },
        { icon: '🔐', label: 'Enterprise Security' },
        { icon: '💯', label: 'ROI Guarantee' },
    ]

    return (
        <section className="trust-bar bg-dark-soft">
            <div className="container">
                <div className="trust-grid">
                    {trusted.map((item, i) => (
                        <div key={i} className="trust-item">
                            <span className="trust-icon">{item.icon}</span>
                            <span className="trust-label">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TrustBar
