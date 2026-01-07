import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Wind, Zap, Skull, Map, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Zoro.css';

const Carousel = () => {
    const images = [
        { id: 1, src: '/images/zoro1.jpg', alt: 'Zoro Battle Stance' },
        { id: 2, src: '/images/zoro2.jpg', alt: 'Zoro Training' },
        { id: 3, src: '/images/zoro3.jpg', alt: 'Zoro Drinking' },
        { id: 4, src: '/images/zoro4.jpg', alt: 'Zoro Sleeping' }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="carousel-container glass-panel">
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex].src}
                    alt={images[currentIndex].alt}
                    className="carousel-image"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    onError={(e) => {
                        e.target.src = `https://via.placeholder.com/800x400?text=${images[currentIndex].alt}`;
                    }}
                />
            </AnimatePresence>
            <button className="carousel-btn prev" onClick={prevSlide}><ChevronLeft /></button>
            <button className="carousel-btn next" onClick={nextSlide}><ChevronRight /></button>
            <div className="carousel-indicators">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        className={`indicator ${idx === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(idx)}
                    />
                ))}
            </div>
        </div>
    );
};

export const Zoro = () => {
    return (
        <div className="zoro-page">
            <div className="zoro-hero-bg">
                <div className="overlay-gradient"></div>
                <img src="/images/zoro.jpg" alt="Zoro Background" className="bg-image" />
            </div>

            <div className="zoro-hero-content">
                <motion.div
                    className="zoro-header-content"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="role-chip">VICE-CAPITÁN</div>
                    <h1 className="zoro-title">RORONOA <span className="text-green">ZORO</span></h1>
                    <p className="zoro-subtitle">"El Rey del Infierno"</p>

                    <div className="stats-row">
                        <StatItem icon={Sword} label="Estilo" value="Santoryu" />
                        <StatItem icon={Wind} label="Recompensa" value="1,111,000,000 ฿" />
                        <StatItem icon={Zap} label="Haki" value="Conquistador" />
                    </div>
                </motion.div>
            </div>

            <div className="content-container">
                <section className="section-block centered-section">
                    <SectionTitle title="Galería de Combate" icon={Skull} />
                    <Carousel />
                </section>

                <section className="section-block">
                    <SectionTitle title="Arsenal Maldito" icon={Sword} />
                    <div className="swords-grid">
                        <SwordCard
                            name="Wado Ichimonji"
                            grade="O Wazamono"
                            desc="La espada de la promesa. Su filo blanco representa la voluntad de Kuina."
                            img="/images/wado.jpg"
                        />
                        <SwordCard
                            name="Sandai Kitetsu"
                            grade="Wazamono"
                            desc="La espada maldita. Eligió a Zoro por su suerte superior a la maldición."
                            img="/images/kitetsu.jpg"
                        />
                        <SwordCard
                            name="Enma"
                            grade="O Wazamono"
                            desc="La espada del Infierno. Domarla requiere un Haki monstruoso."
                            img="/images/enma.jpg"
                        />
                    </div>
                </section>

                <section className="section-block">
                    <SectionTitle title="Posturas Maestras" icon={Zap} />
                    <div className="postures-grid">
                        <PostureCard
                            name="Ittoryu: Iai Shishi Sonson"
                            desc="Un corte veloz capaz de cortar el acero."
                            img="/images/posture1.jpg"
                        />
                        <PostureCard
                            name="Santoryu: Rengoku Onigiri"
                            desc="Un ataque de tres vías que desgarra al oponente."
                            img="/images/posture2.jpg"
                        />
                        <PostureCard
                            name="Kyutoryu: Asura"
                            desc="La manifestación del espíritu demoníaco de Zoro."
                            img="/images/posture3.jpg"
                        />
                    </div>
                </section>

                <section className="section-block">
                    <SectionTitle title="Camino del Guerrero" icon={Map} />
                    <div className="timeline-horizontal">
                        <TimelineEvent year="East Blue" event="Promesa a Kuina" />
                        <TimelineEvent year="Baratie" event="Derrota ante Mihawk" />
                        <TimelineEvent year="Thriller Bark" event="Sacrificio Silencioso" />
                        <TimelineEvent year="Wano" event="Dominio de Enma" />
                    </div>
                </section>
            </div>
        </div>
    );
};

const StatItem = ({ icon: Icon, label, value }) => (
    <div className="stat-pill">
        <Icon size={18} className="stat-icon" />
        <div className="stat-info">
            <span className="stat-label">{label}</span>
            <span className="stat-value">{value}</span>
        </div>
    </div>
);

const SectionTitle = ({ title, icon: Icon }) => (
    <div className="section-header">
        <Icon size={32} className="section-header-icon" />
        <h2>{title}</h2>
        <div className="section-line"></div>
    </div>
);

const SwordCard = ({ name, grade, desc, img }) => (
    <motion.div
        className="sword-card"
        whileHover={{ y: -10 }}
    >
        <div className="sword-img-container">
            <img
                src={img}
                alt={name}
                onError={(e) => e.target.src = 'https://via.placeholder.com/400x150?text=Sword+Image'}
            />
            <div className="sword-grade-badge">{grade}</div>
        </div>
        <div className="sword-content">
            <h3>{name}</h3>
            <p>{desc}</p>
        </div>
    </motion.div>
);

const PostureCard = ({ name, desc, img }) => (
    <motion.div
        className="posture-card"
        whileHover={{ scale: 1.02 }}
    >
        <div className="posture-img-container">
            <img
                src={img}
                alt={name}
                onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=Move'}
            />
        </div>
        <div className="posture-content">
            <h4>{name}</h4>
            <p>{desc}</p>
        </div>
    </motion.div>
);

const TimelineEvent = ({ year, event }) => (
    <div className="timeline-event">
        <div className="timeline-dot"></div>
        <span className="timeline-year">{year}</span>
        <span className="timeline-text">{event}</span>
    </div>
);
