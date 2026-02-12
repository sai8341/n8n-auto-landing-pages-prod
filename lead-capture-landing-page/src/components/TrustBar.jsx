import './TrustBar.css'

function TrustBar() {
    const trustItems = [
        { label: 'SOC2 Compliant' },
        { label: 'AI Excellence 2025' },
        { label: 'API-First Architecture' },
        { label: '4.9/5 Client Rating' },
        { label: 'Enterprise Security' },
        { label: 'ROI Guarantee' },
    ]

    return (
        <section className="trust-bar bg-dark-soft">
            <div className="container">
                <div className="trust-grid">
                    {trustItems.map((item, i) => (
                        <div key={i} className="trust-item">
                            <span className="trust-label">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TrustBar
