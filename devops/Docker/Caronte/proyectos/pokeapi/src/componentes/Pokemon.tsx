import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Error } from './Error';

// Defino los props que yo voy a usar a la hora de mostrar en las cards
interface Pokemon {
    id: number;
    nombre: string;
    imagen: string;
}

export const GaleriaPokemon: React.FC<{ min: number; max: number }> = ({ min, max }) => {
    // Estado para guardar la lista de pokemons
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    //Estado para saber si esta cartgando o no
    const [cargando, setCargando] = useState<boolean>(true);
    // Estado para controlar si ha ocurrido un error
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        // Función para pedir los datos
        const obtenerPokemons = async () => {
            setCargando(true); 
            try {
                // Creo una lista de 10 números aleatorios simples
                const peticion = [];
                const idsGenerados = new Set<number>(); 

                // Uso un while para asegurar que sean 10id únicos
                while (peticion.length < 10) {
                    const id = Math.floor(Math.random() * (max - min + 1)) + min;
                    
                    // Solo si no ha salido ya, lo añado
                    if (!idsGenerados.has(id)) {
                        idsGenerados.add(id);
                        // Guardo la petición (fetch) en el array que será el que luego lea la función map
                        peticion.push(fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json()));
                    }
                }

// Funcion para esperar a que las 10 peticiones terminen a la vez
                const resultados = await Promise.all(peticion);

// Me quedo con los datos que me interesa y accedo a la imagen y teniendo ya el nombre y el id.
                const datosLimpios = resultados.map((data: any) => ({
                    id: data.id,
                    nombre: data.name,
                    // Ruta a la imagen 
                    imagen: data.sprites.other['official-artwork'].front_default,
                }));

// Guardo el estado, si ha fallado, hago que me muestre ese mensaje en la consola
                setPokemons(datosLimpios); 
            } catch (error) {
                console.error("Algo salió mal:", error);
                setError(true);
            } finally {
                setCargando(false); 
            }
        };

        obtenerPokemons();
    }, [min, max]);

// Se muestra este mensaje cuando esta cargando
    if (cargando) return <h2 className="mensaje">Cargando...</h2>;

// Si hay un error, mostramos el componente de error
    if (error) return <Error/>;

// Pintamos la informacion obtenida con la peticion a la api usando los props qdefinidos antes en el componente Card
    return (
        <div className="grid-container">
            {pokemons.map((p) => (
                <Card 
                    key={p.id}
                    nombre={p.nombre}
                    imagen={p.imagen}
                    dato={p.id} 
                    etiqueta="Nº Pokedex" 
                />
            ))}
        </div>
    );
};