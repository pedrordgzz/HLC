import React from 'react';

const AboutMe = () => {
    return (
        <section id="about" className="section" style={{ background: 'var(--bg-primary)' }}>
            <div className="container">
                <h2 className="section-title">Sobre <span className="gradient-text">Mí</span></h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '4rem',
                    alignItems: 'center'
                }}>
                    {/* Left Column: Narrative */}
                    <div>
                        <h3 style={{
                            fontSize: '2rem',
                            fontWeight: 700,
                            marginBottom: '1.5rem',
                            lineHeight: 1.2
                        }}>
                            Más que un desarrollador web,<br />
                            <span style={{ color: 'var(--primary)' }}>Arquitecto de Sistemas.</span>
                        </h3>
                        <p style={{ color: '#ccc', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                            Mi formación como <strong>Técnico Superior en Administración de Sistemas (ASIR)</strong> me da una ventaja competitiva: no solo construyo webs que se ven bien, sino interfaces robustas, seguras y optimizadas desde el servidor hasta el píxel final.
                        </p>
                        <p style={{ color: '#ccc', marginBottom: '2rem', fontSize: '1.1rem' }}>
                            Me especializo en fusionar la creatividad del diseño con la rigurosidad de la ingeniería de sistemas.
                        </p>
                    </div>

                    {/* Right Column: Skill Stack (Clean / Tech Spec Look) */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem'
                    }}>
                        <SkillBar label="Administración de Sistemas (Linux/Windows)" width="95%" />
                        <SkillBar label="Ciberseguridad & Redes" width="85%" />
                        <SkillBar label="Desarrollo Web (React/Node)" width="90%" />
                        <SkillBar label="Cloud Deployment (AWS/Vercel)" width="80%" />
                        <SkillBar label="Automatización IA" width="75%" />
                    </div>
                </div>
            </div>
        </section>
    );
};

const SkillBar = ({ label, width }) => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'white', fontWeight: 500 }}>{label}</span>
        </div>
        <div style={{
            width: '100%',
            height: '6px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
            overflow: 'hidden'
        }}>
            <div style={{
                width: width,
                height: '100%',
                background: 'var(--gradient-main)',
                borderRadius: '10px'
            }}></div>
        </div>
    </div>
);

export default AboutMe;
