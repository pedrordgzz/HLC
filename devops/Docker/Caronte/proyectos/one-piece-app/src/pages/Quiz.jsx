import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trophy, Search, Target, Skull, Zap, Activity } from 'lucide-react';
import { characters } from '../data/characters';
import parchmentBg from '../assets/parchment.jpg';
import './Quiz.css';

export const Quiz = () => {
    const [targetCharacter, setTargetCharacter] = useState(null);
    const [options, setOptions] = useState([]);
    const [lives, setLives] = useState(3);
    const [clues, setClues] = useState([]);
    const [gameState, setGameState] = useState('playing'); // playing, won, lost
    const [score, setScore] = useState(0);

    // Initialize Game
    useEffect(() => {
        startNewRound();
    }, []);

    const generateClues = (char) => {
        const potentialClues = [
            { type: 'AFILIACIÓN', value: char.affiliation, icon: Skull },
            { type: 'ROL', value: char.role, icon: Target },
            { type: 'FRUTA', value: char.devilFruit.hasFruit ? char.devilFruit.type : 'Ninguna', icon: Search },
            { type: 'HAKI', value: char.haki.length > 0 ? char.haki.join(', ') : 'Ninguno', icon: Zap },
            { type: 'RECOMPENSA', value: char.bounty, icon: Trophy },
            { type: 'PISTA', value: char.hints[Math.floor(Math.random() * char.hints.length)], icon: Activity }
        ];
        // Shuffle and pick 3
        return potentialClues.sort(() => 0.5 - Math.random()).slice(0, 3);
    };

    const startNewRound = () => {
        const randomChar = characters[Math.floor(Math.random() * characters.length)];
        setTargetCharacter(randomChar);
        setLives(3);
        setGameState('playing');
        setClues(generateClues(randomChar));

        // Generate options (target + 5 random others for total 6)
        const otherChars = characters.filter(c => c.id !== randomChar.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);
        setOptions([randomChar, ...otherChars].sort(() => 0.5 - Math.random()));
    };

    const handleGuess = (charId) => {
        if (gameState !== 'playing') return;

        if (charId === targetCharacter.id) {
            setGameState('won');
            setScore(s => s + (lives * 100));
        } else {
            setLives(l => l - 1);
            if (lives <= 1) {
                setGameState('lost');
            }
        }
    };

    if (!targetCharacter) return <div className="loading">Cargando Carteles...</div>;

    return (
        <div className="quiz-page">
            <div className="quiz-container">
                {/* Header Section */}
                <header className="quiz-header">
                    <h1>WANTED <span className="highlight">QUIZ</span></h1>
                    <div className="score-board">
                        <div className="lives-container">
                            {[...Array(3)].map((_, i) => (
                                <Heart
                                    key={i}
                                    size={24}
                                    className={i < lives ? 'heart-active' : 'heart-lost'}
                                />
                            ))}
                        </div>
                        <div className="score-display">RECOMPENSA ACUMULADA: {score}</div>
                    </div>
                </header>

                {/* Main Game Area */}
                <div className="game-grid">

                    {/* Character Poster */}
                    <div className="character-section">
                        {/* We use inline style for the background image to ensure Vite resolves the import correctly */}
                        <div
                            className="wanted-poster-container"
                            style={{
                                backgroundImage: `url(${parchmentBg})`,
                            }}
                        >
                            <div className="wanted-header">
                                <h2 className="wanted-title">WANTED</h2>
                                <div className="wanted-subtitle">DEAD OR ALIVE</div>
                            </div>

                            <div className="wanted-image-area">
                                {gameState === 'playing' ? (
                                    <img
                                        src={targetCharacter.image}
                                        alt="Mystery"
                                        className="wanted-image mystery-shadow"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/300x400?text=?'}
                                    />
                                ) : (
                                    <motion.img
                                        src={targetCharacter.image}
                                        alt={targetCharacter.name}
                                        className="wanted-image revealed-image"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                )}
                            </div>

                            <div className="wanted-footer">
                                <div className="wanted-name">{gameState === 'playing' ? '?????' : targetCharacter.name}</div>
                                <div className="wanted-bounty">
                                    <span className="berry-symbol">B</span>
                                    <span>{gameState === 'playing' ? '???,???,???' : targetCharacter.bounty}</span>
                                </div>
                            </div>

                            <AnimatePresence>
                                {gameState === 'won' && (
                                    <motion.div
                                        className="poster-status success"
                                        initial={{ opacity: 0, scale: 2, rotate: -30 }}
                                        animate={{ opacity: 1, scale: 1, rotate: -10 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                    >
                                        CAPTURED
                                    </motion.div>
                                )}
                                {gameState === 'lost' && (
                                    <motion.div
                                        className="poster-status fail"
                                        initial={{ opacity: 0, scale: 2, rotate: 30 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 10 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                    >
                                        ESCAPED
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Intel & Options */}
                    <div className="intel-section">
                        {/* Clues */}
                        <div className="intel-grid">
                            {clues.map((clue, idx) => {
                                const Icon = clue.icon;
                                return (
                                    <motion.div
                                        key={idx}
                                        className="intel-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <div className="intel-icon"><Icon size={24} /></div>
                                        <div className="intel-content">
                                            <div className="intel-label">{clue.type}</div>
                                            <div className="intel-value">{clue.value}</div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Interactive Area */}
                        <div className="options-container">
                            {gameState === 'playing' ? (
                                <div className="options-grid">
                                    {options.map((char) => (
                                        <button
                                            key={char.id}
                                            className="option-button"
                                            onClick={() => handleGuess(char.id)}
                                        >
                                            {char.name}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="result-area">
                                    <div className="dossier-card">
                                        <h3>EXPEDIENTE: {targetCharacter.name}</h3>
                                        <p className="dossier-desc">{targetCharacter.description}</p>
                                        <div className="dossier-details">
                                            <div className="dossier-row">
                                                <span>Afiliación:</span> {targetCharacter.affiliation}
                                            </div>
                                            <div className="dossier-row">
                                                <span>Fruta:</span> {targetCharacter.devilFruit.hasFruit ? targetCharacter.devilFruit.name : 'Ninguna'}
                                            </div>
                                            <div className="dossier-row">
                                                <span>Haki:</span> {targetCharacter.haki.length ? targetCharacter.haki.join(', ') : 'Desconocido'}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="next-round-btn" onClick={startNewRound}>
                                        {gameState === 'won' ? 'SIGUIENTE OBJETIVO' : 'NUEVA BÚSQUEDA'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
