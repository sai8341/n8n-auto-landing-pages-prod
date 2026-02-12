import { business } from '../data/businessData'
import './Footer.css'

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <span className="footer-logo-text">{business.name}</span>
                        </div>
                        <p className="footer-desc">
                            Automating high-growth businesses with custom AI agents and
                            intelligent workflow systems. Built in Hyderabad for the world.
                        </p>
                        <div className="footer-social">
                            <a href={business.social.linkedin} aria-label="LinkedIn">LinkedIn</a>
                            <a href={business.social.twitter} aria-label="Twitter">Twitter</a>
                            <a href={business.social.instagram} aria-label="Instagram">Instagram</a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Solutions</h4>
                        <ul>
                            <li><a href="#services">Custom AI Agents</a></li>
                            <li><a href="#services">Workflow Automation</a></li>
                            <li><a href="#services">Intelligent Chatbots</a></li>
                            <li><a href="#services">Lead Flow Systems</a></li>
                            <li><a href="#services">AI Strategy</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Resources</h4>
                        <ul>
                            <li><a href="#why-us">Why AI Automation</a></li>
                            <li><a href="#use-cases">Use Cases</a></li>
                            <li><a href="#testimonials">Client Results</a></li>
                            <li><a href="#faq">FAQ</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Contact</h4>
                        <ul className="footer-contact">
                            <li>{business.address}</li>
                            <li>{business.phone}</li>
                            <li>{business.email}</li>
                            <li>{business.hours.weekdays}</li>
                            <li>{business.hours.weekend}</li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>
                        © {new Date().getFullYear()} {business.name}. All rights reserved.
                    </p>
                    <div className="footer-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Security</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
