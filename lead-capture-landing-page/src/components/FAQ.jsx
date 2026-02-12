import { useState } from 'react'
import { faqs } from '../data/businessData'
import './FAQ.css'

function FAQ() {
    const [openIndex, setOpenIndex] = useState(null)

    const toggle = (i) => setOpenIndex(openIndex === i ? null : i)

    return (
        <section id="faq" className="section faq-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">FAQ</span>
                    <h2 className="section-title">Common Questions</h2>
                    <p className="section-subtitle">
                        New to AI automation? We have answered the most common questions from
                        our clients to help you understand the transition.
                    </p>
                </div>

                <div className="faq-list">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className={`faq-item glass ${openIndex === i ? 'open' : ''}`}
                        >
                            <button className="faq-question" onClick={() => toggle(i)}>
                                <span className="faq-q-text">{faq.q}</span>
                                <span className="faq-toggle">{openIndex === i ? '−' : '+'}</span>
                            </button>
                            <div className="faq-answer">
                                <p>{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="faq-cta">
                    <p>Have a specific requirement?</p>
                    <a href="#contact" className="btn btn-primary">
                        Ask Our Experts
                    </a>
                </div>
            </div>
        </section>
    )
}

export default FAQ
