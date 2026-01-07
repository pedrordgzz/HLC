import { motion } from 'framer-motion';
import { Sword, Wind, Zap, Skull, Map } from 'lucide-react';
import './Zoro.css';

export const Zoro = () => {
    return (
        <div className="zoro-page">
            <div className="zoro-hero">
                <motion.div
                    className="zoro-content"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="role-tag">CAZADOR DE PIRATAS</div>
                    <h1 className="zoro-title">RORONOA<br /><span className="highlight-green">ZORO</span></h1>

                    <div className="stats-grid">
                        <div className="stat-item">
                            <Sword className="stat-icon" />
                            <span>Usuario del Santoryu</span>
                        </div>
                        <div className="stat-item">
                            <Wind className="stat-icon" />
                            <span>Recompensa: 1,111,000,000</span>
                        </div>
                        <div className="stat-item">
                            <Zap className="stat-icon" />
                            <span>Haki del Conquistador</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="content-grid">
                <div className="technique-column">
                    <SectionTitle title="Las Tres Espadas" icon={Sword} />
                    <div className="swords-display glass-panel">
                        <SwordItem
                            name="Wado Ichimonji"
                            desc="La espada de Kuina. Espada de Gran Grado."
                            grade="Gran Grado"
                        />
                        <SwordItem
                            name="Sandai Kitetsu"
                            desc="Una espada maldita. Afilada pero sedienta de sangre."
                            grade="Grado"
                        />
                        <SwordItem
                            name="Enma"
                            desc="La espada que cortó a Kaido. Extrae Haki."
                            grade="Gran Grado"
                        />
                    </div>

                    <SectionTitle title="Santoryu Ogi" icon={Zap} />
                    <div className="technique-list">
                        <TechniqueCard
                            name="Ichidai San Zen Daisen Sekai"
                            translation="Gran Hazaña del Dragón: Tres Mil Mundos"
                            desc="Una técnica secreta mejorada usada para cortar a Pica."
                        />
                        <TechniqueCard
                            name="Ashura: Bakkei Moja no Tawamure"
                            translation="Asura: Juego de los Muertos"
                            desc="Usa Haki del Conquistador para infligir una cicatriz duradera a Kaido."
                        />
                        <TechniqueCard
                            name="Rengoku Onigiri"
                            translation="Corte del Demonio del Purgatorio"
                            desc="Una versión vastamente más poderosa de su movimiento característico."
                        />
                    </div>
                </div>

                <div className="history-column">
                    <SectionTitle title="Camino del Asura" icon={Map} />
                    <div className="timeline">
                        <TimelineItem
                            year="East Blue"
                            title="La Promesa"
                            desc="Juró a Luffy convertirse en el Mejor Espadachín del Mundo o morir en el intento."
                        />
                        <TimelineItem
                            year="Thriller Bark"
                            title="No Pasó Nada"
                            desc="Tomó todo el dolor de Luffy de Kuma, demostrando su lealtad."
                        />
                        <TimelineItem
                            year="Salto Temporal"
                            title="Inclinándose ante el Enemigo"
                            desc="Rogó a Mihawk que lo entrenara por el bien de su capitán."
                        />
                        <TimelineItem
                            year="País de Wano"
                            title="Rey del Infierno"
                            desc="Derrotó a King el Incendio y despertó el Haki del Conquistador avanzado."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const SectionTitle = ({ title, icon: Icon }) => (
    <div className="section-title-wrapper">
        <Icon className="section-icon" size={24} />
        <h2 className="section-title">{title}</h2>
    </div>
);

const SwordItem = ({ name, desc, grade }) => (
    <motion.div
        className="sword-item"
        whileHover={{ x: 10, borderColor: 'var(--zoro-green)' }}
    >
        <div className="sword-header">
            <h3>{name}</h3>
            <span className="sword-grade">{grade}</span>
        </div>
        <p>{desc}</p>
    </motion.div>
);

const TechniqueCard = ({ name, translation, desc }) => (
    <motion.div
        className="technique-card"
        whileHover={{ scale: 1.02, backgroundColor: 'rgba(0, 250, 154, 0.05)' }}
    >
        <h3>{name}</h3>
        <div className="translation">{translation}</div>
        <p>{desc}</p>
    </motion.div>
);

const TimelineItem = ({ year, title, desc }) => (
    <div className="timeline-item">
        <div className="timeline-marker"></div>
        <div className="timeline-content">
            <div className="timeline-year">{year}</div>
            <h4>{title}</h4>
            <p>{desc}</p>
        </div>
    </div>
);
