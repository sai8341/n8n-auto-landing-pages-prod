import { dummyProjects } from '../data/businessData'
import './FeaturedProjects.css'

function FeaturedProjects() {
    return (
        <section id="projects" className="section projects-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">Our Expertise</span>
                    <h2 className="section-title">Case Studies & Projects</h2>
                    <p className="section-subtitle">
                        Explore how we've helped businesses automate their operations and
                        scale efficiently with custom-built AI solutions.
                    </p>
                </div>

                <div className="projects-grid">
                    {dummyProjects.map((project, i) => (
                        <div key={i} className="project-card glass animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="project-image-wrap">
                                <img src={project.image} alt={project.title} className="project-image" />
                                <div className="project-tags">
                                    {project.tags.map((tag, j) => (
                                        <span key={j} className="project-tag">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="project-content">
                                <h3 className="project-title">{project.title}</h3>
                                <p className="project-desc">{project.description}</p>
                                <div className="project-results">
                                    <h4>Key Outcomes:</h4>
                                    <ul>
                                        {project.results.map((result, j) => (
                                            <li key={j}>
                                                <span className="result-icon">✨</span>
                                                {result}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <a href="#contact" className="project-link">
                                    Request Similar Automation →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturedProjects
