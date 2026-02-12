import { useCases } from '../data/businessData'
import './UseCases.css'

function UseCases() {
    return (
        <section id="use-cases" className="section use-cases-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">AI in Action</span>
                    <h2 className="section-title">Industry Use Cases</h2>
                    <p className="section-subtitle">
                        See how our AI agents and automated workflows are being deployed across
                        different sectors to drive meaningful business outcomes.
                    </p>
                </div>

                <div className="use-cases-grid">
                    {useCases.map((useCase, i) => (
                        <div key={i} className="use-case-card glass">
                            <div className="use-case-header">
                                <span className="use-case-industry">{useCase.industry}</span>
                                <h3 className="use-case-title">{useCase.title}</h3>
                            </div>
                            <div className="use-case-impact">
                                <span className="impact-label">Observed Impact</span>
                                <span className="impact-value">{useCase.impact}</span>
                            </div>
                            <p className="use-case-desc">{useCase.description}</p>
                            <div className="use-case-footer">
                                <a href="#contact" className="use-case-link">
                                    Explore Similar Solution →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default UseCases
