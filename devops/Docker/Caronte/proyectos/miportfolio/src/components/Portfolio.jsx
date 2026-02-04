import React from 'react';
import imgEcommerce from '../assets/portfolio/ecommerce.png';
import imgLanding from '../assets/portfolio/landing.png';
import imgAutomation from '../assets/portfolio/automation.png';
import imgAuth from '../assets/portfolio/auth.png';

const projects = [
    {
        title: "Dashboard E-Commerce",
        category: "Aplicación Web",
        description: "Analíticas en tiempo real para ventas globales.",
        image: imgEcommerce
    },
    {
        title: "Bot Soporte IA",
        category: "Automatización",
        description: "Gestión de clientes, citas y respuestas automáticas en WhatsApp.",
        image: imgAutomation
    },
    {
        title: "Microservicio Auth",
        category: "Sistemas & Seguridad",
        description: "Sistema de autenticación anti-fraude desarrollado en Python.",
        image: imgAuth
    },
    {
        title: "Landing Corporativa",
        category: "Diseño Web",
        description: "Animaciones fluidas y SEO optimizado.",
        image: imgLanding
    }
];

const Portfolio = () => {
    return (
        <section id="portfolio" className="section" style={{ background: 'var(--bg-primary)' }}>
            <div className="container">
                <h2 className="section-title">
                    Proyectos <span className="gradient-text">Destacados</span>
                </h2>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '2rem',
                    justifyContent: 'center'
                }}>
                    {projects.map((project, index) => (
                        <div key={index} style={{
                            position: 'relative',
                            height: '350px',
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease',
                            flex: '1 1 350px',
                            maxWidth: '100%'
                        }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'scale(1.03)';
                                e.currentTarget.style.borderColor = 'var(--primary)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(255,0,127,0.3)';
                                const bgImg = e.currentTarget.querySelector('.project-bg-image');
                                if (bgImg) bgImg.style.opacity = '0';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                e.currentTarget.style.boxShadow = 'none';
                                const bgImg = e.currentTarget.querySelector('.project-bg-image');
                                if (bgImg) bgImg.style.opacity = '0.5';
                            }}
                        >
                            {/* Background Image */}
                            <div className="project-bg-image" style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                backgroundImage: `url(${project.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                opacity: 0.5,
                                transition: 'opacity 0.3s ease',
                                zIndex: 0
                            }}></div>

                            {/* Base Dark Background */}
                            <div style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                background: 'var(--bg-card)',
                                zIndex: -1
                            }}></div>

                            {/* Content Overlay */}
                            <div style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                padding: '2rem',
                                background: 'rgba(0,0,0,0.7)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                transition: 'background 0.3s',
                                zIndex: 1
                            }}>
                                <span style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                    {project.category}
                                </span>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.2, textTransform: 'uppercase' }}>
                                    {project.title}
                                </h3>
                                <p style={{ color: '#ccc', fontSize: '1rem', maxWidth: '90%' }}>
                                    {project.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
