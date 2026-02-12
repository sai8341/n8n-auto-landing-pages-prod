import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TrustBar from './components/TrustBar'
import Services from './components/Services'
import WhyChooseUs from './components/WhyChooseUs'
import UseCases from './components/UseCases'
import Testimonials from './components/Testimonials'
import LeadCaptureForm from './components/LeadCaptureForm'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import './App.css'

function App() {
    return (
        <div className="app">
            <Navbar />
            <Hero />
            <TrustBar />
            <Services />
            <WhyChooseUs />
            <UseCases />
            <Testimonials />
            <LeadCaptureForm />
            <FAQ />
            <Footer />
        </div>
    )
}

export default App
