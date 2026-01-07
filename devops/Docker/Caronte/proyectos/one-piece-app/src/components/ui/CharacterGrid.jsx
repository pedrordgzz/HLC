import { motion } from 'framer-motion';
import { characters } from '../../data/characters';
import './CharacterGrid.css';

export const CharacterGrid = ({ affiliation, title, themeColor }) => {
    const filteredChars = characters.filter(c => c.affiliation === affiliation);

    return (
        <div className="crew-page">
            <div className="crew-header">
                <h1 style={{ color: themeColor }} className="crew-title">{title}</h1>
            </div>

            <div className="char-grid">
                {filteredChars.map((char) => (
                    <motion.div
                        key={char.id}
                        className="char-card glass-panel"
                        whileHover={{ y: -10 }}
                        style={{ borderTop: `4px solid ${themeColor}` }}
                    >
                        <div className="char-image">
                            <img
                                src={char.image}
                                alt={char.name}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                                }}
                            />
                        </div>
                        <div className="char-info">
                            <h3>{char.name}</h3>
                            <div className="char-role">{char.role}</div>
                            <p className="char-desc">{char.description}</p>

                            <div className="char-meta">
                                {char.bounty !== 'None' && (
                                    <div className="bounty">
                                        <span>Bounty:</span>
                                        <br />
                                        <span className="berry-symbol">฿</span> {char.bounty}
                                    </div>
                                )}
                                {char.devilFruit.hasFruit && (
                                    <div className="devil-fruit">
                                        <span>Devil Fruit:</span>
                                        <br />
                                        {char.devilFruit.name}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
