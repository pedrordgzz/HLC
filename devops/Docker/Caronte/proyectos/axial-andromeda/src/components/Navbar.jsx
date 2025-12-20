import React, { useState } from 'react';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem 2rem',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            position: 'fixed',
            width: '100%',
            top: 0,
            zIndex: 1000,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
            <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                ASIR<span style={{ color: 'white' }}>.DEV</span>
            </div>

            {/* Desktop Menu */}
            <div className="nav-links desktop-only" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <NavLinks />
            </div>

            {/* Mobile Menu Icon */}
            <div className="mobile-only" onClick={toggleMenu} style={{ cursor: 'pointer', color: 'white', fontSize: '1.5rem' }}>
                {isMobileMenuOpen ? '✕' : '☰'}
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div style={{
                    position: 'fixed',
                    top: '70px',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.95)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2rem',
                    zIndex: 999
                }}>
                    <NavLinks onClick={toggleMenu} isMobile={true} />
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .desktop-only { display: none !important; }
                }
                @media (min-width: 769px) {
                    .mobile-only { display: none !important; }
                }
            `}</style>
        </nav>
    );
};

const NavLinks = ({ onClick, isMobile }) => {
    const baseStyle = {
        fontWeight: 500,
        color: 'var(--text-secondary)',
        fontSize: isMobile ? '1.5rem' : '1rem'
    };

    return (
        <>
            <a href="#about" style={baseStyle} onClick={onClick}>Sobre Mí</a>
            <a href="#services" style={baseStyle} onClick={onClick}>Servicios</a>
            <a href="#portfolio" style={baseStyle} onClick={onClick}>Portafolio</a>
            <a href="#contact" className="btn btn-primary pulse-animation" style={{
                padding: '0.5rem 1.5rem',
                fontSize: '0.9rem',
                marginLeft: isMobile ? '0' : '1rem'
            }} onClick={onClick}>
                Contacto
            </a>
        </>
    );
};

export default Navbar;
