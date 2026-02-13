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
                    <div className="hero-badge animate-in">
                        <span className="badge-dot" />
                        Next-Gen AI Automation for Business ⚡
                    </div>

                    <h1 className="hero-title animate-in">
                        {heroData.headline.split('\n').map((line, i) => (
                            <span key={i}>
                                {i > 0 && <br />}
                                {line}
                            </span>
                        ))}
                    </h1>

                    <p className="hero-subtitle animate-in" style={{ animationDelay: '0.1s' }}>
                        {heroData.subheadline}
                    </p>

                    <div className="hero-actions animate-in" style={{ animationDelay: '0.2s' }}>
                        <a href="#contact" className="btn btn-primary btn-lg">
                            {heroData.cta} 🚀
                        </a>
                        <a href="#services" className="btn btn-outline">
                            {heroData.ctaSecondary} 🔍
                        </a>
                    </div>

                    <div className="hero-trust animate-in" style={{ animationDelay: '0.3s' }}>
                        <div className="trust-avatars">
                            {['AR', 'PS', 'MC', 'SK', 'JT'].map((initials, i) => (
                                <div key={i} className="trust-avatar" style={{ zIndex: 5 - i, background: `hsl(${i * 40 + 220}, 70%, 60%)` }}>
                                    {initials}
                                </div>
                            ))}
                        </div>
                        <div className="trust-text">
                            <span className="trust-stars">⭐⭐⭐⭐⭐ 5.0 Rating</span>
                            <span className="trust-count">Trusted by 50+ innovative business owners</span>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="hero-card glass">
                        <div className="hero-card-inner">
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
                </div>
            </div>
        </section>
    )
}

export default Hero
