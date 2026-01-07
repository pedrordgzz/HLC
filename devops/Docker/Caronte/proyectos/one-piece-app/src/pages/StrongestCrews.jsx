import { motion } from 'framer-motion';
import { Skull, Flag, Anchor } from 'lucide-react';
import './StrongestCrews.css';

const crews = [
    {
        id: 'strawhats',
        name: 'Piratas del Sombrero de Paja',
        captain: 'Monkey D. Luffy',
        bounty: '8,816,001,000',
        description: 'Una tripulación ascendente que ha desafiado al Gobierno Mundial y derrocado a dos Emperadores del Mar. Liderados por el nuevo Emperador, Sombrero de Paja Luffy.',
        icon: Skull,
        color: '#C41E3A'
    },
    {
        id: 'redhair',
        name: 'Piratas del Pelirrojo',
        captain: 'Shanks',
        bounty: '4,142,900,000+',
        description: 'La tripulación más equilibrada e impenetrable de los Cuatro Emperadores. Su capitán inspiró a Luffy a convertirse en pirata.',
        icon: Flag,
        color: '#8B0000'
    },
    {
        id: 'blackbeard',
        name: 'Piratas de Barbanegra',
        captain: 'Marshall D. Teach',
        bounty: '3,996,000,000',
        description: 'Cazadores de habilidades que buscan el poder absoluto. Su capitán es el único humano conocido con el poder de dos Frutas del Diablo.',
        icon: Skull,
        color: '#4B0082'
    },
    {
        id: 'crossguild',
        name: 'Cross Guild',
        captain: 'Buggy (Figura Pública)',
        bounty: '8,848,000,000',
        description: 'Una organización que ha puesto precio a las cabezas de los Marines. Fundada por Crocodile y Mihawk, con Buggy como líder nominal.',
        icon: Anchor,
        color: '#FFD700'
    }
];

export const StrongestCrews = () => {
    return (
        <div className="strongest-crews-page">
            <h1 className="page-title text-gradient-gold">LAS POTENCIAS DEL MUNDO</h1>

            <div className="crews-list">
                {crews.map((crew, index) => (
                    <motion.div
                        key={crew.id}
                        className="crew-card glass-panel"
                        initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                    >
                        <div className="crew-icon" style={{ color: crew.color }}>
                            <crew.icon size={60} />
                        </div>
                        <div className="crew-details">
                            <h2 style={{ color: crew.color }}>{crew.name}</h2>
                            <div className="crew-stat">
                                <span className="label">Capitán:</span>
                                <span className="value">{crew.captain}</span>
                            </div>
                            <div className="crew-stat">
                                <span className="label">Recompensa Total:</span>
                                <span className="value berry">฿ {crew.bounty}</span>
                            </div>
                            <p className="crew-desc">{crew.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
