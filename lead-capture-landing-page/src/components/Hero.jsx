import { heroData } from '../data/businessData'
import './Hero.css'

function Hero() {
    return (
        <section className="hero">
            <div className="hero-bg-shapes">
                <div className="hero-circle circle-1" />
                <div className="hero-circle circle-2" />
                <div className="hero-circle circle-3" />
            </div>

            <div className="container hero-content">
                <div className="hero-text">
                    <div className="hero-badge">
                        <span className="badge-dot" />
                        Next-Gen AI Automation for Business
                    </div>

                    <h1 className="hero-title">
                        {heroData.headline.split('\n').map((line, i) => (
                            <span key={i}>
                                {i > 0 && <br />}
                                {line}
                            </span>
                        ))}
                    </h1>

                    <p className="hero-subtitle">{heroData.subheadline}</p>

                    <div className="hero-actions">
                        <a href="#contact" className="btn btn-primary btn-lg">
                            🚀 {heroData.cta}
                        </a>
                        <a href="#services" className="btn btn-outline">
                            {heroData.ctaSecondary} →
                        </a>
                    </div>

                    <div className="hero-trust">
                        <div className="trust-avatars">
                            {['AR', 'PS', 'MC', 'SK', 'JT'].map((initials, i) => (
                                <div key={i} className="trust-avatar" style={{ zIndex: 5 - i }}>
                                    {initials}
                                </div>
                            ))}
                        </div>
                        <div className="trust-text">
                            <span className="trust-stars">⭐⭐⭐⭐⭐</span>
                            <span className="trust-count">Rated 4.9/5 by 50+ business owners</span>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="hero-card glass">
                        <div className="hero-card-inner">
                            <div className="hero-emoji">🤖</div>
                            <h3>AI-First Operations</h3>
                            <p>Automate anything. Scale everything.</p>
                            <div className="hero-card-stats">
                                {heroData.stats.map((stat, i) => (
                                    <div key={i} className="hero-stat">
                                        <span className="stat-value">{stat.value}</span>
                                        <span className="stat-label">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="floating-badge badge-1">⚡ Ultra-Fast ROI</div>
                    <div className="floating-badge badge-2">✅ API-First</div>
                    <div className="floating-badge badge-3">🧠 Smart Agents</div>
                </div>
            </div>
        </section>
    )
}

export default Hero
