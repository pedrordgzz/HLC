import React from 'react';

const Logo = ({ fontSize = '1.5rem', style = {}, ...props }) => {
    return (
        <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: fontSize,
            letterSpacing: '-1px',
            display: 'inline-flex',
            alignItems: 'center',
            ...style
        }} {...props}>
            <span className="gradient-text" style={{ paddingRight: '2px' }}>PJRG</span>
            <span style={{ color: 'var(--text-primary)', fontSize: '1.2em', lineHeight: 0, marginBottom: '5px' }}>.</span>
        </div>
    );
};

export default Logo;
