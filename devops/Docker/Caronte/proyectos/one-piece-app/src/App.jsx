import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { Zoro } from './pages/Zoro'
import { Quiz } from './pages/Quiz'
import { StrawHats, Revolutionaries, Marines } from './pages/Crews'
import { StrongestCrews } from './pages/StrongestCrews'
import { DevilFruits } from './pages/DevilFruits'

function Placeholder({ title }) {
    return (
        <div style={{ padding: '2rem', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 className="text-gradient-gold">{title}</h1>
            <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.6)' }}>Contenido próximamente...</p>
        </div>
    )
}

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/zoro" element={<Zoro />} />
                    <Route path="/quiz" element={<Quiz />} />
                    <Route path="/straw-hats" element={<StrawHats />} />
                    <Route path="/revolutionaries" element={<Revolutionaries />} />
                    <Route path="/marines" element={<Marines />} />
                    <Route path="/strongest-crews" element={<StrongestCrews />} />
                    <Route path="/devil-fruits" element={<DevilFruits />} />
                    <Route path="/arcs" element={<Placeholder title="Crónica de Aventuras" />} />
                </Routes>
            </Layout>
        </Router>
    )
}

export default App
