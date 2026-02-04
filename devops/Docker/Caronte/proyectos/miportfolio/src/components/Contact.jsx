import React from 'react';

const Contact = () => {
    return (
        <section id="contact" className="section" style={{ background: 'var(--bg-secondary)' }}>
            <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
                <h2 className="section-title">Contáctame</h2>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input type="text" placeholder="Nombre" style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                    <input type="email" placeholder="Email" style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                    <textarea placeholder="Mensaje" rows="5" style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}></textarea>
                    <button type="submit" className="btn btn-primary pulse-animation" style={{ marginTop: '1rem' }}>Enviar Mensaje</button>
                </form>
            </div>
        </section>
    );
};

export default Contact;
