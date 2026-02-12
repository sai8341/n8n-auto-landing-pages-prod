import { whyChooseUs } from '../data/businessData'
import './WhyChooseUs.css'

function WhyChooseUs() {
    return (
        <section id="why-us" className="section why-section">
            <div className="container">
                <div className="why-layout">
                    <div className="why-left">
                        <span className="section-label">Why Saikumar.ai</span>
                        <h2 className="section-title">The Competitive Advantage</h2>
                        <p className="section-subtitle">
                            In a world where speed and intelligence defined the winners, we provide
                            the technical edge needed to dominate your market.
                        </p>

                        <div className="why-stats">
                            <div className="why-stat">
                                <span className="why-stat-num">10k+</span>
                                <span className="why-stat-label">Hours Saved</span>
                            </div>
                            <div className="why-stat">
                                <span className="why-stat-num">95%</span>
                                <span className="why-stat-label">Faster Response</span>
                            </div>
                            <div className="why-stat">
                                <span className="why-stat-num">4.9</span>
                                <span className="why-stat-label">Client Rating</span>
                            </div>
                        </div>
                    </div>

                    <div className="why-right">
                        {whyChooseUs.map((item, i) => (
                            <div key={i} className="why-card glass">
                                <span className="why-card-icon">{item.icon}</span>
                                <div className="why-card-text">
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WhyChooseUs
