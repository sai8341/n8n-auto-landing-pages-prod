import { useState } from 'react'
import { services } from '../data/businessData'
import './Services.css'

function Services() {
    const [activeIndex, setActiveIndex] = useState(null)

    return (
        <section id="services" className="section services-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">AI Solutions</span>
                    <h2 className="section-title">End-to-End AI Automation</h2>
                    <p className="section-subtitle">
                        We leverage cutting-edge AI models and automation frameworks to build
                        custom solutions that solve your most complex operational challenges.
                    </p>
                </div>

                <div className="services-grid">
                    {services.map((service, i) => (
                        <div
                            key={i}
                            className={`service-card glass ${activeIndex === i ? 'active' : ''}`}
                            onMouseEnter={() => setActiveIndex(i)}
                            onMouseLeave={() => setActiveIndex(null)}
                        >
                            <div className="service-icon-wrap">
                                <span className="service-icon">{service.icon}</span>
                            </div>
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-desc">{service.description}</p>
                            <ul className="service-features">
                                {service.features.map((f, j) => (
                                    <li key={j}>
                                        <span className="feature-check">✓</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <a href="#contact" className="service-cta">
                                Get Started with {service.title} →
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Services
