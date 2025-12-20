import Hero from './components/Hero';
import AboutMe from './components/AboutMe';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';
import MouseFollower from './components/MouseFollower';
import './App.css';

function App() {
    return (
        <div className="app">
            <MouseFollower />
            <Navbar />
            <main>
                <Hero />
                <AboutMe />
                <Services />
                <Portfolio />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}

// Missing Navbar import in the original snippet, adding it
import Navbar from './components/Navbar';

export default App;
