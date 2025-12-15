import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { Navbar } from './componentes/Navbar';
import { GaleriaPokemon } from './componentes/Pokemon';
import { GaleriaDigimon } from './componentes/Digimon';
import { Error } from './componentes/Error';
import { Card } from './componentes/Card';

// Defino los props que yo voy a usar a la hora de mostrar en las cards
interface Pokemon {
    id: number;
    nombre: string;
    imagen: string;
}

const Inicio: React.FC = () => {
    // Estado para guardar el pokemon (en este caso solo uno, pero mantengo la estructura)
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    //Estado para saber si esta cartgando o no
    const [cargando, setCargando] = useState<boolean>(true);
    // Estado para controlar si ha ocurrido un error
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        // Función para pedir los datos
        const obtenerPokemon = async () => {
            setCargando(true); 
            try {
                // Genero un ID aleatorio entre 1 y 386 (Generaciones 1, 2 y 3)
                const id = Math.floor(Math.random() * 386) + 1;
                
                // Guardamos la petición (fetch)
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                const data = await response.json();

                // Me quedo con los datos que me interesa y accedo a la imagen y teniendo ya el nombre, id y hp.
                const datosLimpios: Pokemon = {
                    id: data.id,
                    nombre: data.name,
                    // Ruta a la imagen 
                    imagen: data.sprites.other['official-artwork'].front_default,
                };

                // Guardo el estado, si ha fallado, hago que me muestre ese mensaje en la consola
                setPokemon(datosLimpios); 
            } catch (error) {
                console.error("Algo salió mal:", error);
                setError(true);
            } finally {
                setCargando(false); 
            }
        };

        obtenerPokemon();
    }, []);

    // Se muestra este mensaje cuando esta cargando
    if (cargando) return <div className="mensaje"><h2>Cargando Pokémon sorpresa...</h2></div>;

    // Si hay un error, mostramos el componente de error
    if (error) return <div className="mensaje"><Error/></div>;

    return (
        <div className="mensaje">
            <h1>Bienvenido a la Poke-Digi de Pedro Juan Rodríguez Jiménez</h1>
            <p>Aquí tienes un Pokémon aleatorio de las primeras 3 generaciones:</p>
            
            {/* Pintamos la informacion obtenida con la peticion a la api usando los props definidos antes en el componente Card */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                {pokemon && (
                    <Card 
                        nombre={pokemon.nombre} 
                        imagen={pokemon.imagen} 
                        dato={pokemon.id} // Cambiado a ID
                        etiqueta="Nº Pokedex" // Cambiado etiqueta
                    />
                )}
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
{/* El Navbar lo pongo fuera para que aparezca siempre si o si */}
            <Navbar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Inicio />} />
                    <Route path="/gen1" element={<GaleriaPokemon min={1} max={151} />} />
                    <Route path="/gen2" element={<GaleriaPokemon min={152} max={251} />} />
                    <Route path="/gen3" element={<GaleriaPokemon min={252} max={386} />} />
                    <Route path="/digimon" element={<GaleriaDigimon />} />
                    <Route path="*" element={<div className="mensaje"><Error/></div>} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;