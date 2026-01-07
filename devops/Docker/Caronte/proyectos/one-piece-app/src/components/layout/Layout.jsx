import { useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Anchor, Sword, Map as MapIcon, Skull, HelpCircle, Wind, Grape } from 'lucide-react';
import './Layout.css';

const NavItem = ({ to, icon: Icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link to={to} className={`nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={24} />
            <span className="nav-label">{label}</span>
            {isActive && (
                <motion.div
                    className="nav-indicator"
                    layoutId="navIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
        </Link>
    );
};

export const Layout = ({ children }) => {
    const location = useLocation();
    const isZoroPage = location.pathname === '/zoro';

    return (
        <div className={`app-container ${isZoroPage ? 'theme-zoro' : 'theme-universe'}`}>
            <nav className="main-nav">
                <div className="nav-logo">
                    <Skull size={32} color={isZoroPage ? 'var(--zoro-green)' : 'var(--op-gold)'} />
                    <span style={{ color: isZoroPage ? 'var(--zoro-green)' : 'var(--op-gold)' }}>ONE PIECE</span>
                </div>

                <div className="nav-links">
                    <NavItem to="/" icon={Anchor} label="Universo" />
                    <NavItem to="/zoro" icon={Sword} label="Zoro" />
                    <NavItem to="/quiz" icon={HelpCircle} label="Quiz" />
                    <NavItem to="/strongest-crews" icon={Skull} label="Poderes" />
                    <NavItem to="/straw-hats" icon={Skull} label="Mugiwara" />
                    {/* <NavItem to="/revolutionaries" icon={Wind} label="Revolucionarios" /> */}
                    {/* <NavItem to="/marines" icon={Anchor} label="Marina" /> */}
                    <NavItem to="/devil-fruits" icon={Grape} label="Frutas" />
                </div>
            </nav>

            <main className="content-wrapper">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};
