import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import './Home.css';

export const Home = () => {
    return (
        <div className="home-page">
            <section className="hero-section">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="subtitle"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        LA GRAN ERA DE LA PIRATERÍA
                    </motion.div>

                    <h1 className="title-main text-gradient-gold">
                        ONE PIECE
                    </h1>

                    <motion.p
                        className="description"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Riqueza, Fama, Poder. El hombre que lo había conseguido todo en este mundo, el Rey de los Piratas, Gold Roger.
                    </motion.p>

                    <motion.button
                        className="cta-button glass-panel"
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Compass size={20} />
                        Zarpar
                    </motion.button>
                </motion.div>
            </section>

            <div className="scroll-indicator">
                <span>El Grand Line</span>
                <div className="line"></div>
            </div>
        </div>
    );
};
