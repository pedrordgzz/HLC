import React from 'react';
import imgDeployment from '../assets/services/deployment.png';
import imgDesign from '../assets/services/design.png';
import imgMaintenance from '../assets/services/maintenance.png';
import imgAI from '../assets/services/ai.png';
import imgBranding from '../assets/services/branding.png';

const servicesList = [
    {
        title: "Despliegue Web",
        description: "Estrategias de despliegue completo usando Vercel, Netlify o VPS. Certificados SSL y pipelines CI/CD.",
        icon: "🚀",
        image: imgDeployment
    },
    {
        title: "Diseño Web",
        description: "Aplicaciones React con estética premium. Experiencias visuales de alto impacto.",
        icon: "🎨",
        image: imgDesign
    },
    {
        title: "Mantenimiento",
        description: "Soporte 24/7, actualizaciones de seguridad y monitoreo de rendimiento.",
        icon: "🛠️",
        image: imgMaintenance
    },
    {
        title: "Automatización IA",
        description: "Bots inteligentes y optimización de flujos de trabajo empresariales.",
        icon: "🤖",
        image: imgAI
    },
    {
        title: "Diseño de Marca",
        description: "Logos memorables e identidad corporativa completa para diferenciar tu empresa.",
        icon: "✒️",
        image: imgBranding
    }
];

const Services = () => {
    return (
        <section id="services" className="section" style={{ background: 'var(--bg-secondary)' }}>
            <div className="container">
                <h2 className="section-title" style={{ textTransform: 'uppercase', letterSpacing: '2px' }}>
                    Mis <span className="gradient-text">Servicios</span>
                </h2>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    justifyContent: 'center'
                }}>
                    {servicesList.map((service, index) => (
                        <div key={index} className="service-card" style={{
                            background: 'var(--bg-card)',
                            padding: '2rem',
                            border: '2px solid rgba(255, 255, 255, 0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            cursor: 'pointer',
                            flex: '1 1 300px',
                            maxWidth: '100%',
                            zIndex: 1
                        }}
                            onMouseOver={e => {
                                e.currentTarget.style.borderColor = 'var(--primary)';
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 127, 0.4)';
                                e.currentTarget.style.transform = 'scale(1.02)';
                                const bgImg = e.currentTarget.querySelector('.service-bg-image');
                                if (bgImg) bgImg.style.opacity = '0';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.transform = 'scale(1)';
                                const bgImg = e.currentTarget.querySelector('.service-bg-image');
                                if (bgImg) bgImg.style.opacity = '0.6';
                            }}
                        >
                            {/* Background Image Layer */}
                            <div className="service-bg-image" style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundImage: `url(${service.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                opacity: 0.6,
                                zIndex: -1,
                                transition: 'opacity 0.3s ease',
                                filter: 'grayscale(30%)'
                            }}></div>

                            {/* Dark Overlay */}
                            <div style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9))',
                                zIndex: -1
                            }}></div>

                            <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(255,0,127,0.5))', zIndex: 2 }}>
                                {service.icon}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', zIndex: 2 }}>
                                {service.title}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '90%', zIndex: 2 }}>
                                {service.description}
                            </p>

                            {/* Decorative Corner */}
                            <div style={{
                                position: 'absolute',
                                top: 0, right: 0, width: '0', height: '0',
                                borderStyle: 'solid', borderWidth: '0 40px 40px 0',
                                borderColor: 'transparent var(--primary) transparent transparent',
                                opacity: 0.5, zIndex: 2
                            }} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
