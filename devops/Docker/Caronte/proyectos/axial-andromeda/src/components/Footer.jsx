import React from 'react';
import Logo from './Logo';

const Footer = () => {
    return (
        <footer style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--bg-primary)', borderTop: '1px solid rgba(255,0,127,0.2)' }}>
            <div style={{ marginBottom: '1.5rem', opacity: 0.9 }}>
                <Logo fontSize="2.5rem" />
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>2025 © Pedro Juan Rodríguez Giménez - Todos los derechos reservados.</p>
        </footer>
    );
};

export default Footer;
