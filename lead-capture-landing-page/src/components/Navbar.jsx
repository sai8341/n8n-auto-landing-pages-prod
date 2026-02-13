import { useState, useEffect } from 'react'
import { business } from '../data/businessData'
import './Navbar.css'

function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const navLinks = [
        { label: 'Solutions', href: '#services' },
        { label: 'Why AI', href: '#why-us' },
        { label: 'Projects', href: '#projects' },
        { label: 'Use Cases', href: '#use-cases' },
        { label: 'Results', href: '#testimonials' },
        { label: 'FAQ', href: '#faq' },
    ]

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-inner">
                <a href="#" className="nav-brand">
                    <span className="brand-logo">🌌</span>
                    <span className="brand-name">{business.name}</span>
                </a>

                <div className={`nav-menu ${mobileOpen ? 'active' : ''}`}>
                    <ul className="nav-links">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    {/* Only show in mobile menu */}
                    <div className="nav-menu-footer">
                        <a href="#contact" className="btn btn-primary btn-full" onClick={() => setMobileOpen(false)}>
                            Free Strategy Call 🚀
                        </a>
                    </div>
                </div>

                <div className="nav-right">
                    {/* Desktop only CTA */}
                    <a href="#contact" className="btn btn-primary nav-cta">
                        Free Strategy Call 🚀
                    </a>
                    <button
                        className="mobile-toggle"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={mobileOpen}
                    >
                        <span className={`hamburger ${mobileOpen ? 'open' : ''}`}>
                            <span />
                            <span />
                            <span />
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
