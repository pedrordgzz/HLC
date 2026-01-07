import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, HelpCircle, Trophy, AlertTriangle } from 'lucide-react';
import { characters } from '../data/characters';
import './Quiz.css';

export const Quiz = () => {
    const [targetCharacter, setTargetCharacter] = useState(null);
    const [options, setOptions] = useState([]);
    const [lives, setLives] = useState(5);
    const [hintsUnlocked, setHintsUnlocked] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, won, lost
    const [score, setScore] = useState(0);

    // Initialize Game
    useEffect(() => {
        startNewRound();
    }, []);

    const startNewRound = () => {
        const randomChar = characters[Math.floor(Math.random() * characters.length)];
        setTargetCharacter(randomChar);
        setLives(5);
        setHintsUnlocked(0);
        setGameState('playing');

        // Generate options (target + 3 random others)
        const otherChars = characters.filter(c => c.id !== randomChar.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        setOptions([randomChar, ...otherChars].sort(() => 0.5 - Math.random()));
    };

    const handleGuess = (charId) => {
        if (gameState !== 'playing') return;

        if (charId === targetCharacter.id) {
            setGameState('won');
            setScore(s => s + (lives * 100));
        } else {
            setLives(l => l - 1);
            setHintsUnlocked(h => Math.min(h + 1, 4));

            if (lives <= 1) {
                setGameState('lost');
            }
        }
    };

    if (!targetCharacter) return <div>Cargando...</div>;

    return (
        <div className="quiz-page">
            <div className="quiz-header">
                <h1 className="text-gradient-gold">ADIVINA EL PERSONAJE</h1>
                <div className="stats-bar glass-panel">
                    <div className="lives">
                        {[...Array(5)].map((_, i) => (
                            <Heart
                                key={i}
                                className={i < lives ? 'heart-active' : 'heart-lost'}
                                fill={i < lives ? '#C41E3A' : 'none'}
                            />
                        ))}
                    </div>
                    <div className="score">Puntuación: {score}</div>
                </div>
            </div>

            <div className="quiz-content">
                <div className="character-display glass-panel">
                    <div className="image-container">
                        {gameState === 'won' || gameState === 'lost' ? (
                            <motion.img
                                initial={{ filter: 'blur(20px)' }}
                                animate={{ filter: 'blur(0px)' }}
                                src={targetCharacter.image}
                                alt="Character"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x400?text=No+Image'; // Fallback
                                    e.target.style.filter = 'grayscale(100%)';
                                }}
                            />
                        ) : (
                            <div className="mystery-silhouette">
                                <HelpCircle size={80} color="rgba(255,255,255,0.2)" />
                            </div>
                        )}

                        {gameState === 'won' && (
                            <motion.div className="result-badge win" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                <Trophy size={40} /> ¡BUSCADO!
                            </motion.div>
                        )}
                        {gameState === 'lost' && (
                            <motion.div className="result-badge lose" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                <AlertTriangle size={40} /> DERROTA
                            </motion.div>
                        )}
                    </div>
                </div>

                <div className="game-area">
                    <div className="hints-section glass-panel">
                        <h3>Informe de Inteligencia</h3>
                        <ul className="hints-list">
                            <HintItem label="Afiliación" value={targetCharacter.affiliation} unlocked={hintsUnlocked >= 0} />
                            <HintItem label="Rol" value={targetCharacter.role} unlocked={hintsUnlocked >= 1} />
                            <HintItem
                                label="Fruta del Diablo"
                                value={targetCharacter.devilFruit.hasFruit ? 'Usuario' : 'No Usuario'}
                                unlocked={hintsUnlocked >= 2}
                            />
                            <HintItem
                                label="Pista Específica"
                                value={targetCharacter.hints[0]}
                                unlocked={hintsUnlocked >= 3}
                            />
                            <HintItem
                                label="Dato Crítico"
                                value={targetCharacter.hints[1]}
                                unlocked={hintsUnlocked >= 4}
                            />
                        </ul>
                    </div>

                    <div className="options-grid">
                        {gameState === 'playing' ? (
                            options.map((char) => (
                                <motion.button
                                    key={char.id}
                                    className="option-btn glass-panel"
                                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleGuess(char.id)}
                                >
                                    {char.name}
                                </motion.button>
                            ))
                        ) : (
                            <button className="option-btn glass-panel play-again" onClick={startNewRound}>
                                {gameState === 'won' ? 'Cobrar (Siguiente)' : 'Reintentar'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const HintItem = ({ label, value, unlocked }) => (
    <li className={`hint-item ${unlocked ? 'unlocked' : 'locked'}`}>
        <span className="hint-label">{label}:</span>
        <span className="hint-value">{unlocked ? value : '???'}</span>
    </li>
);
