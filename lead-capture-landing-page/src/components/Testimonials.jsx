import { useState } from 'react'
import { testimonials } from '../data/businessData'
import './Testimonials.css'

function Testimonials() {
    const [active, setActive] = useState(0)

    const next = () => setActive((i) => (i + 1) % testimonials.length)
    const prev = () => setActive((i) => (i - 1 + testimonials.length) % testimonials.length)

    return (
        <section id="testimonials" className="section testimonials-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">Success Stories</span>
                    <h2 className="section-title">What Our Clients Say</h2>
                    <p className="section-subtitle">
                        See how forward-thinking business owners are leveraging Saikumar.ai
                        to eliminate technical debt and human error from their operations.
                    </p>
                </div>

                <div className="testimonials-carousel">
                    <div className="testimonial-main glass">
                        <div className="testimonial-quote">"</div>
                        <p className="testimonial-text">{testimonials[active].text}</p>
                        <div className="testimonial-rating">
                            {testimonials[active].rating}.0 Rating
                        </div>
                        <div className="testimonial-author">
                            <div className="author-avatar">
                                {testimonials[active].avatar}
                            </div>
                            <div className="author-info">
                                <span className="author-name">{testimonials[active].name}</span>
                                <span className="author-role">{testimonials[active].role}</span>
                            </div>
                            <span className="author-service">{testimonials[active].service}</span>
                        </div>
                    </div>

                    <div className="carousel-controls">
                        <button onClick={prev} className="carousel-btn" aria-label="Previous">
                            ←
                        </button>
                        <div className="carousel-dots">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    className={`carousel-dot ${i === active ? 'active' : ''}`}
                                    onClick={() => setActive(i)}
                                    aria-label={`Testimonial ${i + 1}`}
                                />
                            ))}
                        </div>
                        <button onClick={next} className="carousel-btn" aria-label="Next">
                            →
                        </button>
                    </div>
                </div>

                {/* Mini testimonial cards */}
                <div className="testimonials-grid">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className={`mini-testimonial glass ${i === active ? 'active' : ''}`}
                            onClick={() => setActive(i)}
                        >
                            <div className="mini-avatar">{t.avatar}</div>
                            <div className="mini-info">
                                <span className="mini-name">{t.name}</span>
                                <span className="mini-service">{t.service}</span>
                            </div>
                            <span className="mini-rating">{t.rating}.0 Rating</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials
