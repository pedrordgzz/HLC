import { motion } from 'framer-motion';
import { Grape, Flame, Zap, Wind, AlertCircle } from 'lucide-react';
import './DevilFruits.css';

const fruits = [
    {
        name: 'Gomu Gomu no Mi (Hito Hito: Nika)',
        type: 'Zoan Mítica',
        user: 'Monkey D. Luffy',
        desc: 'Otorga al cuerpo las propiedades de la goma. En su despertar, el usuario se convierte en la encarnación del Dios del Sol Nika, luchando con absoluta libertad.',
        color: '#9370DB',
        icon: Grape
    },
    {
        name: 'Mera Mera no Mi',
        type: 'Logia',
        user: 'Sabo / Ace',
        desc: 'Permite al usuario crear, controlar y transformarse en fuego a voluntad. Una fruta destructiva con un legado ardiente.',
        color: '#FF4500',
        icon: Flame
    },
    {
        name: 'Hana Hana no Mi',
        type: 'Paramecia',
        user: 'Nico Robin',
        desc: 'Permite al usuario brotar partes de su cuerpo en cualquier superficie, como flores floreciendo.',
        color: '#FF69B4',
        icon: Grape
    },
    {
        name: 'Magu Magu no Mi',
        type: 'Logia',
        user: 'Akainu (Sakazuki)',
        desc: 'Convierte al usuario en un hombre de magma. Posee el poder ofensivo más alto de todas las frutas del diablo.',
        color: '#8B0000',
        icon: AlertCircle
    },
    {
        name: 'Pika Pika no Mi',
        type: 'Logia',
        user: 'Kizaru (Borsalino)',
        desc: 'Permite al usuario convertirse en luz. Otorga velocidad inmensa y la capacidad de disparar láseres.',
        color: '#FFD700',
        icon: Zap
    },
    {
        name: 'Yomi Yomi no Mi',
        type: 'Paramecia',
        user: 'Brook',
        desc: 'Otorga una segunda vida al usuario. También permite controlar el alma y el frío del inframundo.',
        color: '#00FA9A',
        icon: Wind
    }
];

export const DevilFruits = () => {
    return (
        <div className="fruits-page">
            <h1 className="fruits-title text-gradient-gold">ENCICLOPEDIA DE FRUTAS</h1>

            <div className="fruits-grid">
                {fruits.map((fruit, index) => (
                    <motion.div
                        key={index}
                        className="fruit-card glass-panel"
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -10, borderColor: fruit.color }}
                        style={{ borderTop: `4px solid ${fruit.color}` }}
                    >
                        <div className="fruit-header">
                            <fruit.icon size={40} color={fruit.color} />
                            <span className="fruit-type" style={{ borderColor: fruit.color, color: fruit.color }}>
                                {fruit.type}
                            </span>
                        </div>

                        <h2>{fruit.name}</h2>
                        <div className="fruit-user">Usuario: {fruit.user}</div>
                        <p>{fruit.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
