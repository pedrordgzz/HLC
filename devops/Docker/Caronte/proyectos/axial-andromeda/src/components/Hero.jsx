import React from 'react';

const Hero = () => {
    return (
        <section style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, #1a050f 0%, #000000 70%)',
            textAlign: 'center',
            padding: '0 1rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                <h1 style={{
                    fontSize: '4rem',
                    fontWeight: 800,
                    marginBottom: '1rem',
                    lineHeight: 1.1
                }}>
                    SOLUCIONES WEB <br />
                    <span className="gradient-text">NEXT-GEN</span>
                </h1>
                <p style={{
                    fontSize: '1.2rem',
                    color: 'var(--text-secondary)',
                    maxWidth: '600px',
                    margin: '0 auto 2.5rem'
                }}>
                    Desarrollo Web Full Stack & Administración de Sistemas.
                    Creo experiencias digitales rápidas, seguras y visualmente impactantes.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <a href="#portfolio" className="btn btn-primary">Ver Proyectos</a>
                    <a href="#contact" className="btn btn-outline">Hablemos</a>
                </div>
            </div>

            {/* Decorative Background Glow */}
            <div style={{
                position: 'absolute',
                width: '500px',
                height: '500px',
                background: 'var(--primary)',
                filter: 'blur(150px)',
                opacity: 0.15,
                borderRadius: '50%',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 0
            }}></div>
        </section>
    );
};

export default Hero;
